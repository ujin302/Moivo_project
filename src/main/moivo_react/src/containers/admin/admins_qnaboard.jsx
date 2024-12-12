import React, { useState, useEffect } from 'react';
import admin_qnaboard from '../../assets/css/admins_qnaboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';
import { PATH } from '../../../scripts/path';
import axios from 'axios';

const Admins_qnaboard = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedType, setSelectedType] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const itemsPerPage = 6;

    const [qnaDataAdmin, setQnaDataAdmin] = useState([]);
    const [questionCategories, setQuestionCategories] = useState([]);
    const [responses, setResponses] = useState({}); // 각 질문의 응답 상태 관리

    useEffect(() => {
        fetchQnaDataAdmin();
        fetchQuestionCategories();
    }, []);

    const fetchQnaDataAdmin = async () => {
        try {
            const response = await axios.get(`${PATH.SERVER}/api/admin/qna/management/questions`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setQnaDataAdmin(response.data);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
            setQnaDataAdmin([]);
        }
    };

    const fetchQuestionCategories = async () => {
        try {
            const response = await axios.get(`${PATH.SERVER}/api/admin/qna/management/categories`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setQuestionCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch question categories:', error);
            setQuestionCategories([]);
        }
    };

    const handleResponseChange = (questionId, value) => {
        setResponses({ ...responses, [questionId]: value });
    };

    const handleRespondClick = async (questionId) => {
        try {
            await axios.post(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`, responses[questionId], {
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('답변이 성공적으로 등록되었습니다.');
            fetchQnaDataAdmin();
        } catch (error) {
            console.error('Failed to respond to question:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    const handleUpdateClick = async (questionId) => {
        try {
            await axios.put(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`, responses[questionId], {
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('답변이 성공적으로 수정되었습니다.');
            fetchQnaDataAdmin();
        } catch (error) {
            console.error('Failed to update response:', error);
            alert('답변 수정에 실패했습니다.');
        }
    };

    const handleDeleteClick = async (questionId) => {
        try {
            await axios.delete(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('답변이 성공적으로 삭제되었습니다.');
            fetchQnaDataAdmin();
        } catch (error) {
            console.error('Failed to delete response:', error);
            alert('답변 삭제에 실패했습니다.');
        }
    };

    const filteredData = selectedType
        ? qnaDataAdmin.filter(item => item.categoryDTO.name === selectedType)
        : qnaDataAdmin;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    return (
        <div className={admin_qnaboard.qnalistMainDiv}>
            <div className={admin_qnaboard.sidebar}>
                <Admins_side />
            </div>
            <div className={admin_qnaboard.qnalistContainer}>
                <div className={admin_qnaboard.dropdownContainer}>
                    <button className={admin_qnaboard.dropdownBtn} onClick={() => setIsDropdownVisible(!isDropdownVisible)}>
                        문의 유형 {isDropdownVisible ? '▲' : '▼'}
                    </button>
                    {isDropdownVisible && (
                        <ul className={admin_qnaboard.filterList}>
                            <li onClick={() => setSelectedType('')}>전체</li>
                            {questionCategories.map((category) => (
                                <li key={category.id} onClick={() => setSelectedType(category.name)}>
                                    {category.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {currentPageData.map((item, index) => (
    <div key={item.id} className={admin_qnaboard.qnalistItem}>
        {/* 질문 제목 및 비밀 여부 표시 */}
        <div onClick={() => handleToggle(index + startIndex)}>
            {item.secret && <span>[비밀글]</span>}
            <span>{item.title}</span>
        </div>
        
        {/* 질문 상세보기 */}
        {activeIndex === index + startIndex && (
            <div>
                <p>{item.content}</p>
                
                {/* 답변 및 작성일 추가 */}
                <div className={admin_qnaboard.qnalistDetails}>
                    <div className={admin_qnaboard.qnalistUserAnswer}>
                        {item.response ? (
                            <>
                                <p>{item.response}</p>
                                <p>답변 작성일: {item.responseDate ? item.responseDate : '작성일 없음'}</p>
                            </>
                        ) : (
                            <p>아직 답변이 등록되지 않았습니다.</p>
                        )}
                    </div>
                </div>

                {/* 답변 작성/수정/삭제 */}
                <textarea
                    value={responses[item.id] || ''}
                    onChange={(e) => handleResponseChange(item.id, e.target.value)}
                />
                                <button onClick={() => handleRespondClick(item.id)}>답변 등록</button>
                                <button onClick={() => handleUpdateClick(item.id)}>답변 수정</button>
                                <button onClick={() => handleDeleteClick(item.id)}>답변 삭제</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admins_qnaboard;
