import React, { useState, useEffect } from 'react';
import QnA from '../../assets/css/qna_faqboard.module.css';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

const Qna_faqboard = () => {
  // FAQ 열림 상태 관리
  const [openFAQ, setOpenFAQ] = useState(null);
  const [faqList, setFaqList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 기본 1
  const itemsPerPage = 6; // 한 페이지에 표시할 FAQ 항목 수

  // FAQ 목록을 가져오는 함수
  useEffect(() => {
    const fetchFAQs = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/api/user/question/faq/list');
        console.log('API Response:', response.data);
        
        const faqs = Array.isArray(response.data) ? response.data : [];
        
        if (faqs.length === 0) {
          setError('등록된 FAQ가 없습니다.');
        } else {
          setFaqList(faqs);
          setError(null);
        }
      } catch (error) {
        console.error('FAQ 목록을 가져오는데 실패했습니다:', error);
        setError('FAQ 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setFaqList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const handleToggle = (id) => {
      // 동일한 항목을 클릭하면 닫고, 새 항목을 클릭하면 열리도록 처리
      setOpenFAQ(openFAQ === id ? null : id);
  };

  // 현재 페이지에 표시할 FAQ 항목들을 계산
  const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지의 마지막 항목 인덱스
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지의 첫 항목 인덱스
  const currentItems = faqList.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 표시할 FAQ 항목들

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={QnA.faqmainDiv}>
      <div><Banner /></div>
      <div className={QnA.faqheader}></div>
      <div className={QnA.faqcoment}> 자주 묻는 질문 </div>
      <div className={QnA.faqDiv}>
        
      {/* 고객센터 네비*/}
      <div className={QnA.faqNavi}>
        <Link to="/qna_faqboard">
          <button className={QnA.faqNaviBtn}>자주 묻는 질문</button>
        </Link>

        <Link to="/qna_board">
          <button className={QnA.faqNaviBtn}>문의 작성하기</button>
        </Link>

        <Link to="/qna_boardlist">
          <button className={QnA.faqNaviBtn}>문의 게시글</button>
        </Link>
      </div>
      <div className={QnA.faqss}>
        <div className={QnA.faq}>
          {isLoading ? (
            <p>FAQ 목록을 불러오는 중...</p>
          ) : error ? (
            <p className={QnA.errorMessage}>{error}</p>
          ) : currentItems.length === 0 ? (
            <p>등록된 FAQ가 없습니다.</p>
          ) : (
            <>
              {currentItems.map((faq) => (
                <div key={faq.id} className={QnA.faqItem}>
                  <input 
                    id={`faq-${faq.id}`}
                    type="checkbox"
                    checked={openFAQ === faq.id}
                    onChange={() => handleToggle(faq.id)}
                  />
                  <label htmlFor={`faq-${faq.id}`}>
                    <p className={QnA.faqHeading}>{faq.title}</p>
                    <div className={QnA.faqArrow}></div>
                  </label>
                  {openFAQ === faq.id && (
                    <p className={QnA.faqText}>
                      {faq.content}
                    </p>
                  )}
                </div>
              ))}
              {/* 페이지네이션 버튼 */}
              <div className={QnA.pagination}>
                {Array.from({ length: Math.ceil(faqList.length / itemsPerPage) }).map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? QnA.activePage : ''}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Qna_faqboard;