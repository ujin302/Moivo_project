import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QnA_b from '../../assets/css/qna_boardlist.module.css';
import { Link } from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import { PATH } from '../../../scripts/path';

const Qna_boardlist = () => {
    const [qnaData, setQnaData] = useState([]); // 서버에서 가져올 데이터
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [selectedType, setSelectedType] = useState(''); // 선택된 문의 유형
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // 드롭다운 상태
    const itemsPerPage = 6; // 페이지당 항목 수

    // 서버에서 문의 데이터를 가져오는 함수
    const fetchQnaData = async () => {
        try {
            const response = await axios.get(`${PATH.SERVER}/api/user/question`);
            setQnaData(response.data.QuestionList || []);
        } catch (error) {
            console.error('Error fetching QnA data:', error);
        }
    };

    useEffect(() => {
        fetchQnaData();
    }, []);

    // 문의 유형에 따라 필터링된 데이터 생성
    const filteredData = selectedType
        ? qnaData.filter(item => {
            switch (selectedType) {
                case '일반 문의': return item.categoryId === 1;
                case '비밀 문의': return item.categoryId === 2;
                case '기타 문의': return item.categoryId === 3;
                case '사이즈 문의': return item.categoryId === 4;
                default: return true;
            }
        })
        : qnaData;

    // 페이징 데이터 계산
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleToggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setActiveIndex(null); // 페이지 변경 시 열려있는 아이템 초기화
    };

    // 각 문의 유형에 맞는 아이콘을 반환하는 함수
    const getIconForType = (item) => {
        if (item.secret) return <i className="fas fa-lock"></i>; // 비밀문의
        switch (item.categoryId) {
            case 1: return <i className="fas fa-question-circle"></i>; // 일반문의
            case 2: return <i className="fas fa-ruler"></i>; // 사이즈문의
            case 3: return <i className="fas fa-comment-alt"></i>; // 기타문의
            default: return <i className="fas fa-question-circle"></i>;
        }
    };

    // 드롭다운 토글 함수
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
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

                    {/* 드롭다운 목록*/}
                    {isDropdownVisible && (
                        <ul className={QnA_b.filterList}>
                            <li onClick={() => { setSelectedType(''); toggleDropdown(); }}>전체</li>
                            <li onClick={() => { setSelectedType('일반문의'); toggleDropdown(); }}>일반문의</li>
                            <li onClick={() => { setSelectedType('비밀문의'); toggleDropdown(); }}>비밀문의</li>
                            <li onClick={() => { setSelectedType('사이즈문의'); toggleDropdown(); }}>사이즈문의</li>
                            <li onClick={() => { setSelectedType('기타문의'); toggleDropdown(); }}>기타문의</li>
                        </ul>
                    )}
                </div>
                {currentPageData.length === 0 ? (
                    <div>등록된 문의가 없습니다.</div>
                ) : (
                    currentPageData.map((item, index) => (
                        <div key={index} className={QnA_b.qnalistItem}>
                            <div className={QnA_b.qnalistHeader} onClick={() => handleToggle(index + startIndex)}>
                                <span className={QnA_b.qnalistQuestionType}>
                                    {getIconForType(item)}
                                </span>
                                <span className={QnA_b.qnalistQuestionTitle}>
                                    {item.secret ? '비밀글입니다.' : item.title}
                                </span>
                            </div>
                            {activeIndex === index + startIndex && (
                                <div className={QnA_b.qnalistDetails}>
                                    <div className={QnA_b.qnalistUserInfo}>
                                        <span>{item.userId}</span> | <span>{item.questionDate}</span>
                                    </div>
                                    <div className={QnA_b.qnalistUserQuestion}>{item.content}</div>
                                    <div className={QnA_b.qnalistDivider}></div>
                                    <div className={QnA_b.qnalistUserAnswer}>
                                        {item.response || '답변 대기 중'}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                </div>
                {/* 페이징버튼 */}
                <div className={QnA_b.pagination}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} className={`${QnA_b.paginationBtn} ${currentPage === page ? QnA_b.active : ''}`} onClick={() => handlePageChange(page)} >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Qna_boardlist;
