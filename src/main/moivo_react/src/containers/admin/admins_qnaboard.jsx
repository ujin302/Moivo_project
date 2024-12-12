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
    const [response, setResponse] = useState('');
    const [qnaDataAdmin, setQnaDataAdmin] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [questionCategories, setQuestionCategories] = useState([]);

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

    const handleUpdateClick = async (questionId) => {
        try {
            await axios.put(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`, response, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setResponse('');
            fetchQnaDataAdmin();
            alert('답변이 성공적으로 수정되었습니다.');
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
            fetchQnaDataAdmin();
            alert('답변이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete response:', error);
            alert('답변 삭제에 실패했습니다.');
        }
    };

    const filteredData = selectedType
        ? qnaDataAdmin.filter(item => item.categoryDTO.name === selectedType)
        : qnaDataAdmin;

    const totalItems = filteredData.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    //  문의 유형에 맞는 아이콘을 반환하는 함수
    const getIconForType = (type) => {
        switch (type) {
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
    };

    // 드롭다운 토글 함수
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <div className={admin_qnaboard.qnalistMainDiv}>
            <div className={admin_qnaboard.qnalistheader}></div>

            <div className={admin_qnaboard.qnalistTitle}>고객센터</div>
            <div className={admin_qnaboard.sidebar}>
            <Admins_side />
            </div>
            {/* 네비게이션 */}
            <div className={admin_qnaboard.qnalistNavi}>
            </div>
       
            {/* QnA 리스트 */}
            <div className={admin_qnaboard.qnalist}>
                <div className={admin_qnaboard.qnalistContainer}>
                     
                     {/* 문의 유형 드롭다운 버튼 */}
                    <div className={admin_qnaboard.dropdownContainer}>
                        <button className={admin_qnaboard.dropdownBtn} onClick={toggleDropdown}>
                            전체 문의 {isDropdownVisible ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}
                        </button>

                        {/* 드롭다운 목록 */}
                        {isDropdownVisible && (
                            <ul className={admin_qnaboard.filterList}>
                                <li onClick={() => { setSelectedType(''); setIsDropdownVisible(false); setActiveIndex(null); }}>전체</li>
                                {questionCategories.map((category, index) => (
                                    <li key={index} onClick={() => { setSelectedType(category.name); setIsDropdownVisible(false); setActiveIndex(null); }}>
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {currentPageData.length === 0 ? (
                        <div>등록된 문의가 없습니다.</div>
                    ) : (
                        currentPageData.map((item, index) => (
                            <div key={index} className={admin_qnaboard.qnalistItem}>
                               
                                    <div className={admin_qnaboard.qnalistHeader} onClick={() => handleToggle(index + startIndex, item.secret)}>
                                        <span className={admin_qnaboard.qnalistQuestionType}>
                                            {getIconForType(item.categoryDTO.name)}
                                        </span>
                                        <span className={admin_qnaboard.qnalistQuestionTitle}>{item.title || '제목 없음'}</span>
                                        {item.secret && <span className={admin_qnaboard.qnalistSecretLabel}>[비밀글]</span>}
                                    </div>
                                    {(activeIndex === index + startIndex) && (
                                        <div className={admin_qnaboard.qnalistDetails}>
                                            <div className={admin_qnaboard.qnalistUserInfo}>
                                                <span>{item.userId || '작성자 정보 없음'}</span> | <span>{item.questionDate}</span>
                                            </div>
                                            <div className={admin_qnaboard.qnalistUserQuestion}>{item.content}</div>
                                            <div className={admin_qnaboard.qnalistDivider}></div>
                                            <div className={admin_qnaboard.qnalistUserAnswer}>
                                                {item.response || '답변 대기 중'}
                                            </div>
                                            <div className={admin_qnaboard.adminResponseSection}>
                                                {(
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        item.response ? handleUpdateClick(item.id) : handleRespondClick(item.id);
                                                    }}>
                                                        <textarea
                                                            className={admin_qnaboard.responseTextarea}  
                                                            value={response}
                                                            onChange={(e) => setResponse(e.target.value)}
                                                            placeholder="답변을 입력하세요"
                                                        ></textarea>
                                                        <div className={admin_qnaboard.responseButtons}>
                                                            {item.response ? (
                                                                <>
                                                                    <button type="submit" className={admin_qnaboard.responseButton}>
                                                                        답변 수정
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={`${admin_qnaboard.responseButton} ${admin_qnaboard.deleteButton}`}
                                                                        onClick={() => handleDeleteClick(item.id)}
                                                                    >
                                                                        답변 삭제  
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button type="submit" className={admin_qnaboard.responseButton}>
                                                                        답변 등록
                                                                    </button>
                                                                    <br/>
                                                                    <p className={admin_qnaboard.noResponseMessage}>아직 답변이 등록되지 않았습니다.</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            
                        ))
                    )}
                </div>
                {/* 페이징 버튼 */}
                {totalPages > 1 && (
                    <div className={admin_qnaboard.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button key={page} className={`${admin_qnaboard.paginationBtn} ${currentPage === page ? admin_qnaboard.active : ''}`} onClick={() => handlePageChange(page)}>
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admins_qnaboard;

