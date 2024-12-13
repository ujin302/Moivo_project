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

    const handleRespondToQuestion = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found');
                return;
            }
            await axios.post(
                `${PATH.SERVER}/api/admin/qna/management/questions/${selectedQuestion.id}/response`,
                responseInput,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            closeResponseModal();
            fetchQuestions();
        } catch (error) {
            console.error('Failed to respond to question:', error);
        }
    };

    const handleUpdateResponse = async () => {
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
                <div className={admin_qnaboard.dropdownContainer}>
                    <button className={admin_qnaboard.dropdownBtn} onClick={toggleDropdown}>
                        문의 카테고리 {isDropdownVisible ? '▲' : '▼'}
                    </button>
                    {isDropdownVisible && (
                        <ul className={admin_qnaboard.filterList}>
                            <li onClick={() => setSelectedCategory('')}>전체</li>
                            {categories.map((category) => (
                                <li key={category.id} onClick={() => setSelectedCategory(category.id)}>
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    )}
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
                            <span className={admin_qnaboard.qnalistQuestionTitle}>{question.title}</span>
                            {question.secret === "true" && (
                                <span className={admin_qnaboard.qnalistSecretLabel}>[비밀글]</span>
                            )}
                        </div>
                        {activeIndex === question.id && (
                            <div className={admin_qnaboard.qnalistDetails}>
                                <p className={admin_qnaboard.qnalistUserInfo}>
                                    작성자: {question.userId} | 작성일: {new Date(question.questionDate).toLocaleString()}
                                </p>
                                <p className={admin_qnaboard.qnalistUserQuestion}>{question.content}</p>
                                
                                <div className={admin_qnaboard.adminResponseSection}>
                                    {question.response ? (
                                        <>
                                            <p className={admin_qnaboard.qnalistUserAnswer}>
                                                <strong>관리자 답변:</strong> {question.response}
                                            </p>
                                            <p>답변일: {new Date(question.responseDate).toLocaleString()}</p>
                                            <div className={admin_qnaboard.responseButtons}>
                                                <button 
                                                    className={admin_qnaboard.responseButton}
                                                    onClick={() => openEditResponseModal(question.id)}
                                                >
                                                    답변 ���정
                                                </button>
                                                <button
                                                    className={`${admin_qnaboard.responseButton} ${admin_qnaboard.deleteButton}`}
                                                    onClick={() => handleDeleteResponse(question.id)}
                                                >
                                                    답변 삭제
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className={admin_qnaboard.noResponseMessage}>아직 답변이 등록되지 않았습니다.</p>
                                            <button 
                                                className={admin_qnaboard.responseButton}
                                                onClick={() => openResponseModal(question.id)}
                                            >
                                                답변 등록
                                            </button>
                                        </>
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
                        <h3>답변 등록</h3>
                        <form onSubmit={handleRespondToQuestion}>
                            <textarea
                                className={admin_qnaboard.modalInput}
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}
                                required
                            ></textarea>
                            <div className={admin_qnaboard.modalButtons}>
                                <button type="submit">등록</button>
                                <button type="button" onClick={closeResponseModal}>
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editResponseModalOpen && (
                <div className={admin_qnaboard.modalOverlay}>
                    <div className={admin_qnaboard.modalContent}>
                        <h3>답변 수정</h3>
                        <form onSubmit={handleUpdateResponse}>
                            <textarea
                                className={admin_qnaboard.modalInput}
                                value={responseInput}
                                onChange={(e) => setResponseInput(e.target.value)}
                                required
                            ></textarea>
                            <div className={admin_qnaboard.modalButtons}>
                                <button type="submit">수정</button>
                                <button type="button" onClick={closeEditResponseModal}>
                                    취소
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
