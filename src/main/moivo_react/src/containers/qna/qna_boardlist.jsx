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
                secret: item.secret || item.categoryId === 3
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

    const handlePageChange = (page) => {
        fetchQnaData(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    const getIconForType = (item) => {
        if (item.categoryId === 3) return <i className="fas fa-lock"></i>; // 비밀문의 아이콘
    
        // categoryId에 따라 다른 아이콘 표시
        switch (item.categoryId) {
            case 1: return <i className="fas fa-question-circle"></i>; // 일반문의
            case 2: return <i className="fas fa-comment-alt"></i>; // 기타문의
            case 4: return <i className="fas fa-ruler"></i>; // 사이즈문의
            default: return <i className="fas fa-question-circle"></i>; // 기본 아이콘
        }
    };

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handlePasswordCheck = () => {
        if (enteredPassword === selectedPost.password) { 
            setActiveIndex(qnaData.indexOf(selectedPost)); // 해당 글 활성화
            setPasswordModalVisible(false); // 모달 닫기
        } else {
            setPasswordError('비밀번호가 틀렸습니다.');
        }
    };

    const closePasswordModal = () => {
        setPasswordModalVisible(false);
        setEnteredPassword('');
        setPasswordError('');
    };

    // 줄바꿈 문자를 <br />로 변환하는 함수
    const convertNewlinesToBreaks = (text) => {
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

    return (
        <div className={QnA_b.qnalistMainDiv}>
            <div><Banner /></div>
            <div className={QnA_b.qnalistheader}></div>

            <div className={QnA_b.qnalistTitle}>고객센터</div>

            {/* 네비게이션 */}
            <div className={QnA_b.qnalistNavi}>
                <Link to="/qna_faqboard">
                    <button className={QnA_b.qnalistNaviBtn}>자주 묻는 질문</button>
                </Link>
                <Link to="/qna_board">
                    <button className={QnA_b.qnalistNaviBtn}>문의 작성하기</button>
                </Link>
                <Link to="/qna_boardlist">
                    <button className={QnA_b.qnalistNaviBtn}>문의 게시글</button>
                </Link>
            </div>

            {/* QnA 리스트 */}
            <div className={QnA_b.qnalist}>
                <div className={QnA_b.qnalistContainer}>

                    {/* 문의 유형 드롭다운 */}
                    <div className={QnA_b.dropdownContainer}>
                        <button className={QnA_b.dropdownBtn} onClick={toggleDropdown}>
                            {selectedType || '전체 문의'} {isDropdownVisible ? '▲' : '▼'}
                        </button>
                        {isDropdownVisible && (
                            <ul className={QnA_b.filterList}>
                                <li onClick={() => handleFilterChange('')}>전체</li>
                                <li onClick={() => handleFilterChange('일반 문의')}>일반 문의</li>
                                <li onClick={() => handleFilterChange('비밀 문의')}>비밀 문의</li>
                                <li onClick={() => handleFilterChange('사이즈 문의')}>사이즈 문의</li>
                                <li onClick={() => handleFilterChange('기타 문의')}>기타 문의</li>
                            </ul>
                        )}
                    </div>

                    {qnaData.length === 0 ? (
                        <div>등록된 문의가 없습니다.</div>
                    ) : (
                        qnaData.map((item, index) => (
                            <div key={index} className={QnA_b.qnalistItem}>
                                <div className={QnA_b.qnalistHeader} onClick={() => handleToggle(index, item)}>
                                    <span className={QnA_b.qnalistQuestionType}>
                                        {getIconForType(item)}
                                    </span>
                                    <span className={QnA_b.qnalistQuestionTitle}>
                                        {item.categoryId === 3 ? '비밀글입니다.' : item.title}
                                    </span>
                                </div>
                                {activeIndex === index && (
                                    <div className={QnA_b.qnalistDetails}>
                                        <div className={QnA_b.qnalistUserInfo}>
                                            <span> <i className="fas fa-user"></i> ID : {item.userId}</span> | <i className="far fa-clock"></i> <span>{item.questionDate}</span>
                                                {/* 수정, 삭제 버튼 추가 */}
                                                {currentUserId === item.userId && (
                                                <div className={QnA_b.actionButtons}>
                                                    <button onClick={() => handleEditPost(item)}>수정</button>
                                                    <button onClick={() => handleDeletePost(item)}>삭제</button>
                                                </div>
                                            )}
                                        </div>
                                        <div className={QnA_b.qnalistUserQuestion}>{convertNewlinesToBreaks(item.content)}
                                        </div>
                                        <div className={QnA_b.qnalistDivider}></div>
                                        <div className={QnA_b.qnalistUserAnswer}>
                                            {item.response || '답변 대기 중'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {/* 게시글 수정 모달 */}
                    {editModalVisible && (
                        <div className={QnA_b.modalOverlay}>
                            <div className={QnA_b.modalContent}>
                                <h3>문의 수정</h3>
                                
                                {/* 문의 유형 선택 */}
                                <span className={QnA_b.modalQuestionTitle}>문의 유형</span>
                                <select value={editedPost.categoryId} onChange={(e) => setEditedPost({
                                            ...editedPost, 
                                            categoryId: parseInt(e.target.value)
                                        })}
                                className={QnA_b.modalSelect}>
                                    <option value={1}>일반 문의</option>
                                    <option value={2}>기타 문의</option>
                                    <option value={3}>비밀 문의</option>
                                    <option value={4}>사이즈 문의</option>
                                </select>
                                
                                {/* 제목 입력 */}
                                <span className={QnA_b.modalQuestionTitle}>제목</span>
                                <input type="text"  value={editedPost.title} onChange={(e) => setEditedPost({
                                        ...editedPost, 
                                        title: e.target.value
                                    })}
                                    placeholder="제목을 입력하세요"
                                    className={QnA_b.modalInput} />
                                    
                                {/* 비밀글 여부 체크박스 */}
                                <div className={QnA_b.secretCheckbox}>
                                    <label>비밀글</label>
                                    <input type="checkbox" checked={editedPost.categoryId === 3 || editedPost.secret === true} onChange={(e) => setEditedPost({
                                            ...editedPost, 
                                            categoryId: e.target.checked ? 3 : 1,
                                            secret: e.target.checked
                                        })} />
                                </div>

                                {/* 내용 입력 */}
                                <span className={QnA_b.modalQuestionTitle}>내용</span>
                                <textarea value={editedPost.content} onChange={(e) => setEditedPost({
                                        ...editedPost, 
                                        content: e.target.value
                                    })}
                                    placeholder="내용을 입력하세요"
                                    className={QnA_b.modalTextarea} />

                                <div className={QnA_b.modalButtons}>
                                    <button onClick={handleEditSubmit}>수정</button>
                                    <button onClick={() => setEditModalVisible(false)}>취소</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* 페이징 버튼 */}
                <div className={QnA_b.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                        <button key={page} className={`${QnA_b.paginationBtn} ${currentPage === page ? QnA_b.active : ''}`} onClick={() => handlePageChange(page)} >
                            {page + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* 비밀번호 확인 모달 */}
            {passwordModalVisible && (
                <div className={QnA_b.modalOverlay}>
                    <div className={QnA_b.modalContent}>
                        <h3>비밀글 비밀번호 확인</h3>
                        <input type="password" placeholder="비밀번호 입력" value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} className={QnA_b.modalInput} />
                        {passwordError && <p className={QnA_b.errorText}>{passwordError}</p>}
                        <div className={QnA_b.modalButtons}>
                            <button onClick={handlePasswordCheck}>확인</button>
                            <button onClick={closePasswordModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Qna_boardlist;