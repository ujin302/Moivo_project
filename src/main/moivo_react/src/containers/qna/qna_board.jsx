import React, { useState } from 'react';
import QnA_w from '../../assets/css/qna_board.module.css'; 
import { Link } from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';

const qna_board = () => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 게시글 작성 로직 구현
    console.log({ type, title, question, isSecret });
  };

  return (
    <div className={QnA_w.qnaboardMainDiv}>
      <div><Banner /></div>
      <div className={QnA_w.qnaboardheader}></div>

      <div className={QnA_w.qnaboardTitle}>고객센터</div>

      {/* 네비게이션 */}
      <div className={QnA_w.qnaboardNavi}>
        <Link to="/qna_faqboard">
          <button className={QnA_w.qnaboardNaviBtn}>자주 묻는 질문</button>
        </Link>
        <Link to="/qna_board">
          <button className={QnA_w.qnaboardNaviBtn}>문의 작성하기</button>
        </Link>
        <Link to="/qna_boardlist">
          <button className={QnA_w.qnaboardNaviBtn}>문의 게시글</button>
        </Link>
      </div>

      {/* 게시글 작성 폼 */}
      <div className={QnA_w.qnaboardContainer}>
        <div className={QnA_w.qnaboard}>
          <form onSubmit={handleSubmit} className={QnA_w.qnaboardItem}>
            <div className={QnA_w.qnaboardHeader}>
              <span className={QnA_w.qnaboardQuestionType}>문의 유형</span>
              <select className={QnA_w.qnaboardSelect} value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">문의 유형을 선택하세요</option>
                <option value="일반 문의">일반 문의</option>
                <option value="비밀 문의">비밀 문의</option>
                <option value="기타 문의">기타 문의</option>
                <option value="사이즈 문의">사이즈 문의</option>
              </select>
            </div>

            <div className={QnA_w.qnaboardHeader}>
              <span className={QnA_w.qnaboardQuestionType}>제목</span>
              <input type="text" className={QnA_w.qnaboardInput} placeholder="제목을 입력하세요" value={title} onChange={(e) => setTitle(e.target.value)} required/>
            </div>

            {/* 비밀글 체크박스 */}
            <div className={QnA_w.qnaboardHeader} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="isSecret" style={{ fontWeight: 'bold', fontSize: '14px' }}>비밀글</label>
              <input type="checkbox" checked={isSecret} onChange={() => setIsSecret(!isSecret)} id="isSecret"className={QnA_w.qnaboardCheckbox}/></div>

            <div className={QnA_w.qnaboardHeader}>
              <span className={QnA_w.qnaboardQuestionType}>내용</span>
              <textarea className={QnA_w.qnaboardTextarea} placeholder="문의 내용을 입력하세요" value={question} onChange={(e) => setQuestion(e.target.value)} required/>
            </div>

            <div className={QnA_w.qnaboardSubmit}>
              <button type="submit" className={QnA_w.qnaboardSubmitBtn}>작성하기</button>
            </div>
          </form>
        </div> 
      </div>

      <Footer />
    </div>
  );
};

export default qna_board;
