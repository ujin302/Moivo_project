import React, { useState, useEffect } from 'react';
import QnA_b from '../../assets/css/qna_boardlist.module.css';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';

const Qna_boardlist = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [passwordModal, setPasswordModal] = useState({ visible: false, index: null });
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedType, setSelectedType] = useState(''); // 선택된 문의 유형
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 드롭다운 상태
    const itemsPerPage = 6; // 페이지당 항목 수
    const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
    const [accessToken, setAccessToken] = useState(''); // 관리자 토큰
    const [response, setResponse] = useState(''); // 답변 입력을 위한 상태
    const [qnaDataAdmin, setQnaDataAdmin] = useState([]); // 관리자 답변 데이터

    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/admin/qna/management/questions', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setQnaDataAdmin(data);
            }
        } catch (error) {
            console.error('질문 목록 가져오기 실패:', error);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchQuestions();
        }
    }, [isAdmin]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
            // 토큰에서 isAdmin 정보 추출
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            setIsAdmin(tokenData.isAdmin);
        }
    }, []);

    const qnaData = [
        {
            title: '제품 배송 언제 되나요?',
            secret: false,
            type: '일반문의',
            userId: 'user123',
            date: '2024-11-21',
            question: '안녕하세요, 제품 배송 상태를 알고 싶습니다.',
            answer: '안녕하세요, 배송은 내일 출발 예정입니다.',
            password: ''
        },
        {
            title: '개인 정보 관련 문의',
            secret: true,
            type: '비밀문의',
            userId: 'user456',
            date: '2024-11-20',
            question: '개인 정보 보호 정책에 대해 알고 싶습니다.',
            answer: '비밀문의입니다.',
            password: '4567'
        },
        {
            title: '결제 방법 변경은 어떻게 하나요?',
            secret: false,
            type: '기타문의',
            userId: 'user789',
            date: '2024-11-19',
            question: '결제 방법을 변경하고 싶습니다.',
            answer: '결제 방법 변경은 고객센터를 통해 가능합니다.',
            password: ''
        },
        {
            title: '사이즈 문의',
            secret: false,
            type: '사이즈문의',
            userId: 'user123',
            date: '2024-11-18',
            question: '이 옷은 어떤 사이즈로 구입해야 하나요?',
            answer: '이 제품은 M사이즈가 적합합니다.',
            password: ''
        },
        { title: '추가 질문 1', secret: false, type: '기타문의', userId: 'user123', date: '2024-11-17', question: '내용1', answer: null, password: '' },
        { title: '추가 질문 2', secret: false, type: '일반문의', userId: 'user123', date: '2024-11-16', question: '내용2', answer: null, password: '' },
        { title: '추가 질문 3', secret: false, type: '사이즈문의', userId: 'user123', date: '2024-11-15', question: '내용3', answer: null, password: '' },
        { title: '추가 질문 4', secret: false, type: '기타문의', userId: 'user123', date: '2024-11-14', question: '내용4', answer: null, password: '' },
        { title: '추가 질문 5', secret: true, type: '비밀문의', userId: 'user123', date: '2024-11-13', question: '내용5', answer: null, password: '1234' },
    ];

    // 문의 유형에 따라 필터링된 데이터 생성
    const filteredData = selectedType
        ? qnaData.filter(item => item.type === selectedType)
        : qnaData;

    // 페이징 데이터 계산
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleToggle = (index, isSecret) => {
        // 관리자인 경우 비밀글도 바로 볼 수 있음
        if (isAdmin) {
            setActiveIndex(activeIndex === index ? null : index);
            return;
        }
        
        // 일반 사용자인 경우 기존 로직 유지
        if (isSecret) {
            setPasswordModal({ visible: true, index });
        } else {
            setActiveIndex(activeIndex === index ? null : index);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    const handlePasswordCheck = () => {
        const selectedPost = qnaData[passwordModal.index];
        if (enteredPassword === selectedPost.password) {
            setPasswordModal({ visible: false, index: null });
            setActiveIndex(passwordModal.index);  // 비밀글이 맞다면 열림
            setEnteredPassword('');
            setPasswordError('');
        } else {
            setPasswordError('비밀번호가 일치하지 않습니다.');
        }
    };

    const closePasswordModal = () => {
        setPasswordModal({ visible: false, index: null });
        setEnteredPassword('');
        setPasswordError('');
    };

    // 각 문의 유형에 맞는 아이콘을 반환하는 함수
    const getIconForType = (type) => {
        switch (type) {
            case '일반문의':
            case '기타문의':
                return <i className="fas fa-question-circle"></i>;  // 물음표 아이콘
            case '비밀문의':
                return <i className="fas fa-lock"></i>;  // 자물쇠 아이콘
            case '사이즈문의':
                return <i className="fas fa-ruler"></i>;  // 자 아이콘
            default:
                return <i className="fas fa-question-circle"></i>;  // 기본 물음표 아이콘
        }
    };

    // 드롭다운 토글 함수
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // 답변 제출 핸들러
    const handleResponseSubmit = async (questionId) => {
        try {
            const res = await fetch(`/api/admin/qna/management/questions/${questionId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ response })
            });
            
            if (res.ok) {
                // 답변 등록 후 데이터 새로고침
                fetchQuestions();
                setResponse('');
            }
        } catch (error) {
            console.error('답변 등록 실패:', error);
        }
    };

    const handleResponseEdit = async (questionId) => {
        try {
            const res = await fetch(`/api/admin/qna/management/questions/${questionId}/respond`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ response })
            });
            
            if (res.ok) {
                fetchQuestions();
                setResponse('');
            }
        } catch (error) {
            console.error('답변 수정 실패:', error);
        }
    };

    const handleResponseDelete = async (questionId) => {
        if (!window.confirm('답변을 삭제하시겠습니까?')) return;
        
        try {
            const res = await fetch(`/api/admin/qna/management/questions/${questionId}/respond`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (res.ok) {
                fetchQuestions();
            }
        } catch (error) {
            console.error('답변 삭제 실패:', error);
        }
    };

    const renderAdminResponseSection = (item) => {
        if (!isAdmin) return null;
        
        return (
            <div className={QnA_b.adminResponseSection}>
                <textarea
                    className={QnA_b.responseTextarea}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="답변을 입력하세요"
                />
                <div className={QnA_b.responseButtons}>
                    <button 
                        className={QnA_b.responseButton}
                        onClick={() => handleResponseSubmit(item.id)}
                    >
                        답변 등록
                    </button>
                    {item.answer && (
                        <>
                            <button 
                                className={QnA_b.responseButton}
                                onClick={() => handleResponseEdit(item.id)}
                            >
                                수정
                            </button>
                            <button 
                                className={`${QnA_b.responseButton} ${QnA_b.deleteButton}`}
                                onClick={() => handleResponseDelete(item.id)}
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
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
                     
                     {/* 문의 유형 드롭다운 버튼 */}
                    <div className={QnA_b.dropdownContainer}>
                        <button className={QnA_b.dropdownBtn} onClick={toggleDropdown}>
                            전체 문의 {isDropdownVisible ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                        </button>

                        {/* 드롭다운 목록 */}
                        {isDropdownVisible && (
                            <ul className={QnA_b.filterList}>
                                <li onClick={() => { setSelectedType(''); setIsDropdownVisible(false); setActiveIndex(null); }}>전체</li>
                                <li onClick={() => { setSelectedType('일반문의'); setIsDropdownVisible(false); setActiveIndex(null); }}>일반문의</li>
                                <li onClick={() => { setSelectedType('비밀문의'); setIsDropdownVisible(false); setActiveIndex(null); }}>비밀문의</li>
                                <li onClick={() => { setSelectedType('사이즈문의'); setIsDropdownVisible(false); setActiveIndex(null); }}>사이즈문의</li>
                                <li onClick={() => { setSelectedType('기타문의'); setIsDropdownVisible(false); setActiveIndex(null); }}>기타문의</li>
                            </ul>
                        )}
                    </div>
                    {currentPageData.length === 0 ? (
                        <div>등록된 문의가 없습니다.</div>
                    ) : (
                        currentPageData.map((item, index) => (
                            <div key={index} className={QnA_b.qnalistItem}>
                                <div className={QnA_b.qnalistHeader} onClick={() => handleToggle(index + startIndex, item.secret)}>
                                    <span className={QnA_b.qnalistQuestionType}>
                                        {getIconForType(item.type)}
                                    </span>
                                    <span className={QnA_b.qnalistQuestionTitle}>
                                        {item.secret ? '비밀글입니다.' : item.title}
                                    </span>
                                </div>
                                {activeIndex === index + startIndex && (
                                    <div className={QnA_b.qnalistDetails}>
                                        <div className={QnA_b.qnalistUserInfo}>
                                            <span>{item.userId}</span> | <span>{item.date}</span>
                                        </div>
                                        <div className={QnA_b.qnalistUserQuestion}>{item.question}</div>
                                        <div className={QnA_b.qnalistDivider}></div>
                                        <div className={QnA_b.qnalistUserAnswer}>
                                            {item.answer || '답변 대기 중'}
                                        </div>
                                        {renderAdminResponseSection(item)}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                {/* 페이징 버튼 */}
                <div className={QnA_b.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} className={`${QnA_b.paginationBtn} ${currentPage === page ? QnA_b.active : ''}`} onClick={() => handlePageChange(page)}>
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            {/* 비밀번호 확인 모달 */}
            {passwordModal.visible && (
                <div className={QnA_b.modalOverlay}>
                    <div className={QnA_b.modalContent}>
                        <h3>비��글 비밀번호 확인</h3>
                        <input
                            type="password"
                            placeholder="비밀번호 입력"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            className={QnA_b.modalInput}
                        />
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