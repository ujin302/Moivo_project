import React, { useState, useEffect} from 'react';
import axiosInstance from "../../utils/axiosConfig";
import QnA_b from '../../assets/css/qna_boardlist.module.css';
import { Link , useNavigate} from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';

const Qna_boardlist = () => {
    const navigate = useNavigate();
    const [qnaData, setQnaData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false); 
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);

    // 새로운 상태 추가: 편집 모달 관련
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedPost, setEditedPost] = useState({
        categoryId: 1,
        title: '',
        content: '',
        secret: false
    });

    // 현재 로그인한 사용자 ID 상태 추가
    const [currentUserId, setCurrentUserId] = useState(null);

    // 서버에서 문의 데이터를 가져오는 함수
    const fetchQnaData = async (page = 0) => {
        try {
            const response = await axiosInstance.get(`/api/user/question?page=${page}`);
            setQnaData(response.data.QuestionList || []);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
            console.log('API 응답 데이터:', response.data);
        } catch (error) {
            console.error('Error fetching QnA data:', error);
        }
    };

    // 현재 사용자 ID 확인
    const checkUserId = () => {
        const storedUserId = localStorage.getItem('id');
            if (storedUserId) {
                setCurrentUserId(parseInt(storedUserId));
            }
    };

    useEffect(() => {
        fetchQnaData();
        checkUserId();
    }, []);

    // 필터링된 데이터는 백엔드에서 처리하도록 요청할 수도 있음
    const handleFilterChange = (type) => {
        setSelectedType(type);
        setCurrentPage(0);
        fetchQnaData(0);
        setIsDropdownVisible(false);
    };

    const handleToggle = (index, item) => {
        if (!currentUserId) {
            // 로그인하지 않은 유저는 목록을 클릭하면 로그인 화면으로 이동
            alert('로그인이 필요합니다.');
            navigate('/user');
            return;
        }
    
        if (item.categoryId === 3) { // 비밀글인 경우
            if (currentUserId === item.userId) {
                // 자신이 작성한 비밀글인 경우 비밀번호 모달 없이 바로 열기
                setActiveIndex(activeIndex === index ? null : index);
            } else {
                // 다른 사용자가 작성한 비밀글인 경우 비밀번호 모달 표시
                setSelectedPost(item);
                setPasswordModalVisible(true);
            }
        } else {
            // 비밀글이 아닌 경우 바로 열기
            setActiveIndex(activeIndex === index ? null : index);
        }
    };

    // 게시글 수정 핸들러 - 모달 열기
    const handleEditPost = (item) => {
        // 로그인한 사용자의 글만 수정 가능
        if (currentUserId && currentUserId === item.userId) {
            setEditedPost({
                id: item.id,
                categoryId: item.categoryId,
                title: item.title,
                content: item.content,
                secret: item.categoryId === 3
            });
            setEditModalVisible(true);
        } else {
            alert('수정 권한이 없습니다.');
        }
    };

    // 게시글 수정 제출 핸들러
    const handleEditSubmit = async () => {
        try {
            await axiosInstance.put('/api/user/question/update', {
                ...editedPost,
                userId: currentUserId
            });
            
            // 모달 닫기
            setEditModalVisible(false);
            
            // 현재 페이지 다시 불러오기
            fetchQnaData(currentPage);
            
            alert('수정이 완료되었습니다.');
        } catch (error) {
            console.error('수정 중 오류:', error);
            alert('수정에 실패했습니다.');
        }
    };

    // 게시글 삭제 핸들러
    const handleDeletePost = async (item) => {
        // 로그인한 사용자의 글만 삭제 가능
        if (currentUserId && currentUserId === item.userId) {
            if (window.confirm('정말로 삭제하시겠습니까?')) {
                try {
                    await axiosInstance.delete('/api/user/question/delete', {
                        data: { 
                            id: item.id,
                            userId: currentUserId 
                        }
                    });
                    fetchQnaData(currentPage); // 현재 페이지 다시 불러오기
                } catch (error) {
                    console.error('삭제 중 오류:', error);
                    alert('삭제에 실패했습니다.');
                }
            }
        } else {
            alert('삭제 권한이 없습니다.');
        }
    };

    // 나머지 기존 코드는 유지...

    return (
        <div className={QnA_b.qnalistMainDiv}>
            {/* 기존 렌더링 코드... */}

            {/* 게시글 수정 모달 */}
            {editModalVisible && (
                <div className={QnA_b.modalOverlay}>
                    <div className={QnA_b.modalContent}>
                        <h3>문의 수정</h3>
                        
                        {/* 문의 유형 선택 */}
                        <select 
                            value={editedPost.categoryId} 
                            onChange={(e) => setEditedPost({
                                ...editedPost, 
                                categoryId: parseInt(e.target.value)
                            })}
                            className={QnA_b.modalSelect}
                        >
                            <option value={1}>일반 문의</option>
                            <option value={2}>기타 문의</option>
                            <option value={4}>사이즈 문의</option>
                        </select>

                        {/* 비밀글 여부 체크박스 */}
                        <div className={QnA_b.secretCheckbox}>
                            <input 
                                type="checkbox" 
                                checked={editedPost.categoryId === 3}
                                onChange={(e) => setEditedPost({
                                    ...editedPost, 
                                    categoryId: e.target.checked ? 3 : 1
                                })}
                            />
                            <label>비밀글</label>
                        </div>

                        {/* 제목 입력 */}
                        <input 
                            type="text" 
                            value={editedPost.title} 
                            onChange={(e) => setEditedPost({
                                ...editedPost, 
                                title: e.target.value
                            })}
                            placeholder="제목을 입력하세요"
                            className={QnA_b.modalInput}
                        />

                        {/* 내용 입력 */}
                        <textarea 
                            value={editedPost.content} 
                            onChange={(e) => setEditedPost({
                                ...editedPost, 
                                content: e.target.value
                            })}
                            placeholder="내용을 입력하세요"
                            className={QnA_b.modalTextarea}
                        />

                        <div className={QnA_b.modalButtons}>
                            <button onClick={handleEditSubmit}>수정</button>
                            <button onClick={() => setEditModalVisible(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 기존의 비밀번호 모달 코드 유지... */}
            
            <Footer />
        </div>
    );
};

export default Qna_boardlist;