import React, { useState, useEffect } from 'react';
import QnA_b from '../../assets/css/qna_boardlist.module.css';
import { Link } from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import axiosInstance from "../../utils/axiosConfig";

const Qna_boardlist = () => {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedType, setSelectedType] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [passwordModal, setPasswordModal] = useState({ visible: false, index: null });
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // 드롭다운 토글
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // 카테고리 변경 처리
    const handleCategoryChange = (type) => {
        setSelectedType(type);
        setIsDropdownVisible(false);
        setActiveIndex(null);
        setCurrentPage(1);
        fetchQuestions();
    };

    // 비밀글 확인
    const handlePasswordCheck = (index, question) => {
        if (question.secret === "true") {
            setPasswordModal({ visible: true, index });
        } else {
            toggleQuestion(index);
        }
    };

    // 비밀글 모달 닫기
    const closePasswordModal = () => {
        setPasswordModal({ visible: false, index: null });
        setEnteredPassword('');
        setPasswordError('');
    };

    // 비밀번호 확인 처리
    const handlePasswordSubmit = async () => {
        try {
            const question = questions[passwordModal.index];
            const response = await axiosInstance.post('/api/user/question/check-password', {
                questionId: question.id,
                password: enteredPassword
            });

            if (response.data.valid) {
                toggleQuestion(passwordModal.index);
                closePasswordModal();
            } else {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
            console.error('Password check failed:', error);
        }
    };

    // 질문 토글
    const toggleQuestion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // 페이지 변경 처리
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null);
        setPasswordModal({ visible: false, index: null });
        setEnteredPassword('');
        setPasswordError('');
    };

    // 카테고리 아이콘 가져오기
    const getIconForType = (categoryId) => {
        switch (categoryId) {
            case 'BASIC':
                return <i className="fas fa-question-circle"></i>;
            case 'PRIVATE':
                return <i className="fas fa-lock"></i>;
            case 'SIZE':
                return <i className="fas fa-ruler"></i>;
            case 'OTHER':
                return <i className="fas fa-ellipsis-h"></i>;
            default:
                return <i className="fas fa-question"></i>;
        }
    };

    // 질문 목록 가져오기
    const fetchQuestions = async () => {
        try {
            const response = await axiosInstance.get('/api/user/question', {
                params: {
                    page: currentPage - 1,
                    size: 6,
                    categoryId: selectedType
                }
            });
            
            // 응답 데이터 확인
            console.log(response.data); // 응답 데이터 로그 출력
            
            if (response.data && response.data.QuestionList) {
                setQuestions(response.data.QuestionList); // 질문 목록 설정
                setTotalPages(response.data.totalPages); // 총 페이지 수 설정
            } else {
                setQuestions([]); // 데이터가 없을 경우 빈 배열 설정
                setTotalPages(0); // 페이지 수 초기화
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [currentPage, selectedType]);

    // JSX 렌더링 부분
    return (
        <div className={QnA_b.qnalistMainDiv}>
            <Banner />
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
                            {selectedType || '전체 문의'} {isDropdownVisible ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                        </button>

                    {/* 드롭다운 목록 */}
                    {isDropdownVisible && (
                        <ul className={QnA_b.filterList}>
                            <li onClick={() => handleCategoryChange('')}>전체</li>
                            <li onClick={() => handleCategoryChange('BASIC')}>일반문의</li>
                            <li onClick={() => handleCategoryChange('PRIVATE')}>비밀문의</li>
                            <li onClick={() => handleCategoryChange('SIZE')}>사이즈문의</li>
                            <li onClick={() => handleCategoryChange('OTHER')}>기타문의</li>
                        </ul>
                    )}
                </div>

                    {questions.length === 0 ? (
                        <div>등록된 문의가 없습니다.</div>
                    ) : (
                        questions.map((question, index) => (
                            <div key={question.id} className={QnA_b.qnalistItem}>
                                <div className={QnA_b.qnalistHeader} onClick={() => handlePasswordCheck(index, question)}>
                                    <span className={QnA_b.qnalistQuestionType}>
                                        {getIconForType(question.categoryId)}
                                    </span>
                                    <span className={QnA_b.qnalistQuestionTitle}>
                                        {question.secret === "true" ? '비밀글입니다.' : question.title}
                                    </span>
                                </div>
                                {activeIndex === index && (
                                    <div className={QnA_b.qnalistDetails}>
                                        <div className={QnA_b.qnalistUserInfo}>
                                            <span>{question.userId}</span> | <span>{new Date(question.questionDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className={QnA_b.qnalistUserQuestion}>{question.content}</div>
                                        <div className={QnA_b.qnalistDivider}></div>
                                        <div className={QnA_b.qnalistUserAnswer}>
                                            {question.response || '답변 대기 중'}
                                        </div>
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
                    <h3>비밀글 비밀번호 확인</h3>
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        className={QnA_b.modalInput}
                    />
                    {passwordError && <p className={QnA_b.errorText}>{passwordError}</p>}
                    <div className={QnA_b.modalButtons}>
                        <button onClick={handlePasswordSubmit}>확인</button>
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