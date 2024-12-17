import React, { useState, useEffect } from 'react';
import QnA_b from '../../assets/css/qna_boardlist.module.css';
import { Link } from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import axiosInstance from "../../utils/axiosConfig";

const Qna_boardlist = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [passwordModal, setPasswordModal] = useState({ visible: false, index: null });
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedType, setSelectedType] = useState('ALL');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const itemsPerPage = 6;
    const [questions, setQuestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchQuestions();
    }, [currentPage, selectedType, searchQuery]);

    const fetchQuestions = async () => {
        try {
            const response = await axiosInstance.get('/api/user/question', {
                params: {
                    page: currentPage - 1,
                    size: itemsPerPage,
                    block: 10,
                    sortby: 'questiondate',
                    title: searchQuery || null,
                    categoryId: selectedType === 'ALL' ? null : 
                              selectedType === 'PRIVATE' ? null : 
                              CATEGORY_MAPPING[selectedType]
                }
            });
            
            if (response.data) {
                setQuestions(response.data.QuestionList || []);
                setTotalPages(response.data.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        }
    };

    // 카테고리 매핑 (관리자 페이지와 동일하게 통일)
    const CATEGORY_MAPPING = {
        'ALL': 0,      // 전체문의
        'BASIC': 1,    // 일반문의
        'OTHER': 2,    // 기타문의
        'SIZE': 3,     // 사이즈문의
        'PRIVATE': 4   // 비밀문의
    };

    // 카테고리별 아이콘 반환 (관리자 페이지와 동일한 아이콘 사용)
    const getIconForCategory = (categoryId) => {
        switch (categoryId) {
            case 1: // BASIC
            case 2: // OTHER
                return <i className="fas fa-question-circle"></i>;
            case 3: // SIZE
                return <i className="fas fa-ruler"></i>;
            case 4: // PRIVATE
                return <i className="fas fa-lock"></i>;
            default:
                return <i className="fas fa-question-circle"></i>;
        }
    };

    // 카테고리 이름 매핑
    const CATEGORY_NAMES = {
        'ALL': '전체문의',
        'BASIC': '일반문의',
        'OTHER': '기타문의',
        'SIZE': '사이즈문의',
        'PRIVATE': '비밀문의'
    };

    // 필터링 로직 수정
    const filteredQuestions = questions.filter(question => {
        switch(selectedType) {
            case 'ALL':
                return true;
            case 'BASIC':
                return question.categoryId === 1;
            case 'OTHER':
                return question.categoryId === 2;
            case 'SIZE':
                return question.categoryId === 3;
            case 'PRIVATE':
                return question.secret === "true";
            default:
                return true;
        }
    });

    // 페이지네이션 로직 수정
    const totalItems = filteredQuestions.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentPageQuestions = filteredQuestions.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null);
        setPasswordModal({ visible: false, index: null });
        setEnteredPassword('');
        setPasswordError('');
    };

    // 비밀의글 상세보기 토글
    const toggleQuestion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
        setPasswordModal({ visible: false, index: null });
        setEnteredPassword('');
        setPasswordError('');
    };

    // 비밀글 확인
    const handlePasswordCheck = async (index, question) => {
        if (question.secret === "true") {
            setPasswordModal({ visible: true, index });
        } else {
            toggleQuestion(index);
        }
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
                setPasswordModal({ visible: false, index: null });
                setEnteredPassword('');
                setPasswordError('');
            } else {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setPasswordError('비밀번호 확인 중 오류가 발생했습니다.');
            console.error('Password check failed:', error);
        }
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category) => {
        setSelectedType(category);
        setCurrentPage(1); // 카테고리 변경시 첫 페이지로 이동
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // 검색시 첫 페이지로 이동
        fetchQuestions();
    };

    // JSX 렌더링 부분
    return (
        <div className={QnA_b.qnalistMainDiv}>
            <Banner />
            <div className={QnA_b.qnalistheader}>
                <div className={QnA_b.qnalistTitle}>
                    Q&A
                </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className={QnA_b.qnalistNavi}>
                <button 
                    className={QnA_b.qnalistNaviBtn}
                    onClick={() => handleCategoryChange('ALL')}
                >
                    전체문의
                </button>
                <button 
                    className={QnA_b.qnalistNaviBtn}
                    onClick={() => handleCategoryChange('BASIC')}
                >
                    일반문의
                </button>
                <button 
                    className={QnA_b.qnalistNaviBtn}
                    onClick={() => handleCategoryChange('SIZE')}
                >
                    사이즈문의
                </button>
                <button 
                    className={QnA_b.qnalistNaviBtn}
                    onClick={() => handleCategoryChange('OTHER')}
                >
                    기타문의
                </button>
            </div>

            <div className={QnA_b.qnalist}>
                <div className={QnA_b.qnalistContainer}>
                    {questions.map((question, index) => (
                        <div key={question.id} className={QnA_b.qnalistItem}>
                            <div 
                                className={QnA_b.qnalistHeader}
                                onClick={() => handlePasswordCheck(index, question)}
                            >
                                <span className={QnA_b.qnalistQuestionType}>
                                    {getIconForCategory(question.categoryId)}
                                    {CATEGORY_NAMES[Object.keys(CATEGORY_MAPPING).find(
                                        key => CATEGORY_MAPPING[key] === question.categoryId
                                    )]}
                                </span>
                                <span className={QnA_b.qnalistQuestionTitle}>
                                    {question.title}
                                    {question.secret === "true" && (
                                        <span className={QnA_b.qnalistSecretLabel}>
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    )}
                                </span>
                                <span>{new Date(question.questionDate).toLocaleDateString()}</span>
                                <span>{question.response ? '답변완료' : '답변대기'}</span>
                            </div>

                            {activeIndex === index && (
                                <div className={QnA_b.qnalistDetails}>
                                    <div className={QnA_b.qnalistUserInfo}>
                                        <span>작성자: {question.userId}</span> | 
                                        <span>작성일: {new Date(question.questionDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className={QnA_b.qnalistUserQuestion}>{question.content}</div>
                                    {question.response && (
                                        <>
                                            <div className={QnA_b.qnalistDivider}></div>
                                            <div className={QnA_b.qnalistUserAnswer}>
                                                <h4>관리자 답변</h4>
                                                <p>{question.response}</p>
                                                <div className={QnA_b.responseDate}>
                                                    답변일: {new Date(question.responseDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 페이지네이션 */}
                <div className={QnA_b.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${QnA_b.paginationBtn} ${currentPage === page ? QnA_b.active : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            {/* 비밀글 모달 */}
            {passwordModal.visible && (
                <div className={QnA_b.modalOverlay}>
                    <div className={QnA_b.modalContent}>
                        <h3>비밀글입니다</h3>
                        <input
                            type="password"
                            className={QnA_b.modalInput}
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                        />
                        {passwordError && <p className={QnA_b.errorText}>{passwordError}</p>}
                        <div className={QnA_b.modalButtons}>
                            <button onClick={handlePasswordSubmit}>확인</button>
                            <button onClick={() => setPasswordModal({ visible: false, index: null })}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Qna_boardlist;