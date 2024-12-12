import React, { useState, useEffect } from 'react';
import admin_qnaboard from '../../assets/css/admins_qnaboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';
import { PATH } from '../../../scripts/path';
import axios from 'axios';

const Admins_qnaboard = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [passwordModal, setPasswordModal] = useState({ visible: false, index: null });
    const [enteredPassword, setEnteredPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const itemsPerPage = 6;
    const [qnaDataAdmin, setQnaDataAdmin] = useState([]);
    const [response, setResponse] = useState('');
    const [ isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchQnaDataAdmin();
        checkAdminStatus();
    }, [selectedType]);

    const fetchQnaDataAdmin = async () => {
        try {
            const category = selectedType ? selectedType : null;
            const secret = null; // 필요한 경우 secret 값을 설정하세요.
            const response = await axios.get(`${PATH.SERVER}/api/admin/qna/management/questions`, { params: { category, secret } });
            setQnaDataAdmin(response.data);
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        }
    };

    const handleRespondClick = async (questionId) => {
        try {
            await axios.post(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`, response);
            setResponse('');
            fetchQnaDataAdmin();
            alert('답변이 성공적으로 등록되었습니다.');
        } catch (error) {
            console.error('Failed to respond to question:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    const handleUpdateClick = async (questionId) => {
        try {
            await axios.put(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`, response);
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
            await axios.delete(`${PATH.SERVER}/api/admin/qna/management/questions/${questionId}/response`);
            fetchQnaDataAdmin();
            alert('답변이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('Failed to delete response:', error);
            alert('답변 삭제에 실패했습니다.');
        }
    };

    // 문의 유형에 따라 필터링된 데이터 생성
    const filteredData = selectedType
        ? qnaDataAdmin.filter(item => item.categoryEntity.name === selectedType)
        : qnaDataAdmin;

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
        if (isSecret === 'true') {
            // 비밀글이면 비밀번호 모달을 보여줌
            setPasswordModal({ visible: true, index });
        } else {
            // 비밀글이 아니면 해당 게시글 펼침
            setActiveIndex(activeIndex === index ? null : index);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    const handlePasswordCheck = () => {
        const selectedPost = qnaDataAdmin[passwordModal.index];
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

    // 관리자 상태 확인 함수
    const checkAdminStatus = async () => {
        try {
            // 서버에 관리자 상태 확인 요청
            const response = await axios.get(`${PATH.SERVER}/api/admin/check`);
            setIsAdmin(response.data.isAdmin);
        } catch (error) {
            console.error('관리자 상태 확인 실패:', error);
        }
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
                                <li onClick={() => { setSelectedType('BASIC'); setIsDropdownVisible(false); setActiveIndex(null); }}>일반문의</li>
                                <li onClick={() => { setSelectedType('PRIVATE'); setIsDropdownVisible(false); setActiveIndex(null); }}>비밀문의</li>
                                <li onClick={() => { setSelectedType('SIZE'); setIsDropdownVisible(false); setActiveIndex(null); }}>사이즈문의</li>
                                <li onClick={() => { setSelectedType('OTHER'); setIsDropdownVisible(false); setActiveIndex(null); }}>기타문의</li>
                            </ul>
                        )}
                    </div>
                    {currentPageData.length === 0 ? (
                        <div>등록 문의가 없습니다.</div>
                    ) : (
                        currentPageData.map((item, index) => (
                            <div key={index} className={admin_qnaboard.qnalistItem}>
                                <div className={admin_qnaboard.qnalistHeader} onClick={() => handleToggle(index + startIndex, item.secret)}>
                                    <span className={admin_qnaboard.qnalistQuestionType}>
                                        {getIconForType(item.categoryEntity.name)}
                                    </span>
                                    <span className={admin_qnaboard.qnalistQuestionTitle}>
                                        {isAdmin || item.secret !== 'true' ? item.title : '비밀글입니다.'}
                                    </span>
                                </div>
                                {(isAdmin || activeIndex === index + startIndex) && (
                                    <div className={admin_qnaboard.qnalistDetails}>
                                        <div className={admin_qnaboard.qnalistUserInfo}>
                                            <span>{item.userEntity.id}</span> | <span>{item.questionDate}</span>
                                        </div>
                                        <div className={admin_qnaboard.qnalistUserQuestion}>{item.content}</div>
                                        <div className={admin_qnaboard.qnalistDivider}></div>
                                        <div className={admin_qnaboard.qnalistUserAnswer}>
                                            {item.response || '답변 대기 중'}
                                        </div>
                                        <div className={admin_qnaboard.adminResponseSection}>
                                            {isAdmin && (
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
                <div className={admin_qnaboard.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} className={`${admin_qnaboard.paginationBtn} ${currentPage === page ? admin_qnaboard.active : ''}`} onClick={() => handlePageChange(page)}>
                            {page}
                        </button>
                    ))}
                </div>
            </div>

            {/* 비밀번호 확인 모달 */}
            {passwordModal.visible && (
                <div className={admin_qnaboard.modalOverlay}>
                    <div className={admin_qnaboard.modalContent}>
                        <h3>비밀글 비밀번호 확인</h3>
                        <input
                            type="password"
                            placeholder="비밀번호 입력"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            className={admin_qnaboard.modalInput}
                        />
                        {passwordError && <p className={admin_qnaboard.errorText}>{passwordError}</p>}
                        <div className={admin_qnaboard.modalButtons}>
                            <button onClick={handlePasswordCheck}>확인</button>
                            <button onClick={closePasswordModal}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins_qnaboard;

