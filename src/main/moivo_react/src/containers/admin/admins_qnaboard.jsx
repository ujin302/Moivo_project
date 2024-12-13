import React, { useState, useEffect } from 'react';
import admin_qnaboard from '../../assets/css/admins_qnaboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';
import { PATH } from '../../../scripts/path';
import axios from 'axios';

const Admins_qnaboard = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const itemsPerPage = 6;

    const [questions, setQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [responseModalOpen, setResponseModalOpen] = useState(false);
    const [editResponseModalOpen, setEditResponseModalOpen] = useState(false);
    const [responseInput, setResponseInput] = useState('');

    useEffect(() => {
        fetchQuestions();
        fetchCategories();
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.get(`${PATH.SERVER}/api/admin/qna/management/questions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Server response:', response.data);
            setQuestions(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error.response?.data || error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.get(`${PATH.SERVER}/api/admin/qna/management/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Server response:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const openResponseModal = (questionId) => {
        const question = questions.find((q) => q.id === questionId);
        setSelectedQuestion(question);
        setResponseModalOpen(true);
    };

    const closeResponseModal = () => {
        setSelectedQuestion(null);
        setResponseModalOpen(false);
        setResponseInput('');
    };

    const openEditResponseModal = (questionId) => {
        const question = questions.find((q) => q.id === questionId);
        setSelectedQuestion(question);
        setResponseInput(question.response);
        setEditResponseModalOpen(true);
    };

    const closeEditResponseModal = () => {
        setSelectedQuestion(null);
        setEditResponseModalOpen(false);
        setResponseInput('');
    };

    const handleRespondToQuestion = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }

            console.log('Sending response:', responseInput); // 요청 데이터 로깅

            const response = await axios({
                method: 'post',
                url: `${PATH.SERVER}/api/admin/qna/management/questions/${selectedQuestion.id}/response`,
                data: { response: responseInput },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 500; // 302를 포함한 모든 2xx, 3xx, 4xx 상태 허용
                }
            });

            console.log('Server response:', response); // 서버 응답 로깅

            if (response.status === 200) {
                await fetchQuestions();
                closeResponseModal();
                setResponseInput('');
            } else {
                console.error('Failed to submit response:', response.data);
            }
        } catch (error) {
            console.error('Error details:', error.response || error);
        }
    };

    const handleUpdateResponse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.put(
                `${PATH.SERVER}/api/admin/qna/management/questions/${selectedQuestion.id}/response`, 
                responseInput,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            closeEditResponseModal();
            fetchQuestions();
        } catch (error) {
            console.error('Failed to update response:', error);
        }
    };

    const handleDeleteResponse = async (questionId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.delete(
                `${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            fetchQuestions();
        } catch (error) {
            console.error('Failed to delete response:', error);
        }
    };

    // 문의 카테고리에 따라 필터링된 데이터 생성
    const filteredQuestions = selectedCategory
        ? questions.filter(question => question.categoryId === selectedCategory)
        : questions;

    // 페이징 데이터 계산
    const totalItems = filteredQuestions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    // 각 문의 카테고리에 맞는 아이콘을 반환하는 함수
    const getIconForCategory = (categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            switch (category.name) {
                case 'BASIC':
                case 'OTHER':
                    return <i className="fas fa-question-circle"></i>;  // 물음표 아이콘
                case 'PRIVATE':
                    return <i className="fas fa-lock"></i>;  // 자물쇠 아이콘
                case 'SIZE':
                    return <i className="fas fa-ruler"></i>;  // 자 아이콘
                default:
                    return <i className="fas fa-question-circle"></i>;  // 기본 물음표 아이콘
            }
        }
        return <i className="fas fa-question-circle"></i>;  // 카테고리가 없을 경우 기본 물음표 아이콘
    };

    // 드롭다운 토글 함수
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div className={admin_qnaboard.qnalistMainDiv}>
            <div className={admin_qnaboard.sidebar}>
                <Admins_side />
            </div>
            
            <div className={admin_qnaboard.qnalistContainer}>
                <div className={admin_qnaboard.filterSection}>
                    <div className={admin_qnaboard.dropdownContainer}>
                        <button 
                            className={admin_qnaboard.dropdownBtn} 
                            onClick={toggleDropdown}
                        >
                            <span>
                                {selectedCategory 
                                    ? categories.find(c => c.id === selectedCategory)?.name 
                                    : '전체 카테고리'
                                }
                            </span>
                            <i className={`fas fa-chevron-${isDropdownVisible ? 'up' : 'down'}`}></i>
                        </button>
                        {isDropdownVisible && (
                            <ul className={admin_qnaboard.filterList}>
                                <li onClick={() => {
                                    setSelectedCategory('');
                                    toggleDropdown();
                                }}>전체</li>
                                {categories.map((category) => (
                                    <li 
                                        key={category.id} 
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            toggleDropdown();
                                        }}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {currentPageQuestions.map((question) => (
                    <div key={question.id} className={admin_qnaboard.qnalistItem}>
                        <div 
                            className={admin_qnaboard.qnalistHeader}
                            onClick={() => setActiveIndex(activeIndex === question.id ? null : question.id)}
                        >
                            <span className={admin_qnaboard.qnalistQuestionType}>
                                {getIconForCategory(question.categoryId)}
                            </span>
                            <span className={admin_qnaboard.qnalistQuestionTitle}>
                                {question.title}
                            </span>
                            {question.secret === "true" && (
                                <span className={admin_qnaboard.qnalistSecretLabel}>
                                    <i className="fas fa-lock"></i> 비밀글
                                </span>
                            )}
                        </div>
                        
                        {activeIndex === question.id && (
                            <div className={admin_qnaboard.qnalistDetails}>
                                <div className={admin_qnaboard.qnalistUserInfo}>
                                    <i className="fas fa-user"></i> {question.userId} 
                                    <span className={admin_qnaboard.dateDivider}>|</span>
                                    <i className="far fa-clock"></i> {new Date(question.questionDate).toLocaleString()}
                                </div>
                                <div className={admin_qnaboard.qnalistUserQuestion}>
                                    {question.content}
                                </div>
                                
                                <div className={admin_qnaboard.adminResponseSection}>
                                    {question.response ? (
                                        <>
                                            <div className={admin_qnaboard.responseContent}>
                                                <h4><i className="fas fa-comment-dots"></i> 관리자 답변</h4>
                                                <p>{question.response}</p>
                                                <div className={admin_qnaboard.responseDate}>
                                                    <i className="far fa-clock"></i> {new Date(question.responseDate).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className={admin_qnaboard.responseButtons}>
                                                <button 
                                                    className={admin_qnaboard.responseButton}
                                                    onClick={() => openEditResponseModal(question.id)}
                                                >
                                                    <i className="fas fa-edit"></i> 답변 수정
                                                </button>
                                                <button
                                                    className={`${admin_qnaboard.responseButton} ${admin_qnaboard.deleteButton}`}
                                                    onClick={() => handleDeleteResponse(question.id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i> 답변 삭제
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={admin_qnaboard.noResponseWrapper}>
                                            <p className={admin_qnaboard.noResponseMessage}>
                                                <i className="fas fa-info-circle"></i> 아직 답변이 등록되지 않았습니다.
                                            </p>
                                            <button 
                                                className={admin_qnaboard.responseButton}
                                                onClick={() => openResponseModal(question.id)}
                                            >
                                                <i className="fas fa-plus-circle"></i> 답변 등록
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div className={admin_qnaboard.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`${admin_qnaboard.paginationBtn} ${
                                currentPage === page ? admin_qnaboard.active : ''
                            }`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            {responseModalOpen && (
                <div className={admin_qnaboard.modalOverlay}>
                    <div className={admin_qnaboard.modalContent}>
                        <h3><i className="fas fa-plus-circle"></i> 답변 등록</h3>
                        <form onSubmit={handleRespondToQuestion}>
                            <textarea
                                className={admin_qnaboard.modalInput}
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}
                                placeholder="답변을 입력해주세요..."
                                required
                            ></textarea>
                            <div className={admin_qnaboard.modalButtons}>
                                <button type="submit">
                                    <i className="fas fa-check"></i> 등록
                                </button>
                                <button type="button" onClick={closeResponseModal}>
                                    <i className="fas fa-times"></i> 취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editResponseModalOpen && (
                <div className={admin_qnaboard.modalOverlay}>
                    <div className={admin_qnaboard.modalContent}>
                        <h3><i className="fas fa-edit"></i> 답변 수정</h3>
                        <form onSubmit={handleUpdateResponse}>
                            <textarea
                                className={admin_qnaboard.modalInput}
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}
                                placeholder="수정할 답변을 입력해주세요..."
                                required
                            ></textarea>
                            <div className={admin_qnaboard.modalButtons}>
                                <button type="submit">
                                    <i className="fas fa-save"></i> 수정
                                </button>
                                <button type="button" onClick={closeEditResponseModal}>
                                    <i className="fas fa-times"></i> 취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins_qnaboard;