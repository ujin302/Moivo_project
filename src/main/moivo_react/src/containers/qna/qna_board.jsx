import React, { useState } from 'react';
import QnA_b from '../../assets/css/qna_boardlist.module.css'; 
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

      {/* 게시글 작성 폼 */}
      <div className={QnA_b.qnalistContainer}>
        <form onSubmit={handleSubmit} className={QnA_b.qnalistItem}>
          <div className={QnA_b.qnalistHeader}>
            <span className={QnA_b.qnalistQuestionType}>문의 유형</span>
            <select
              className={QnA_b.qnalistSelect}
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">문의 유형을 선택하세요</option>
              <option value="일반 문의">일반 문의</option>
              <option value="비밀 문의">비밀 문의</option>
              <option value="기타 문의">기타 문의</option>
            </select>
          </div>

          <div className={QnA_b.qnalistHeader}>
            <span className={QnA_b.qnalistQuestionType}>제목</span>
            <input
              type="text"
              className={QnA_b.qnalistInput}
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={QnA_b.qnalistHeader}>
            <span className={QnA_b.qnalistQuestionType}>내용</span>
            <textarea
              className={QnA_b.qnalistTextarea}
              placeholder="문의 내용을 입력하세요"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className={QnA_b.qnalistHeader}>
            <span className={QnA_b.qnalistQuestionType}>비밀 문의</span>
            <input
              type="checkbox"
              checked={isSecret}
              onChange={() => setIsSecret(!isSecret)}
            />
            <span>비밀로 작성하기</span>
          </div>

          <div className={QnA_b.qnalistSubmit}>
            <button type="submit" className={QnA_b.qnalistSubmitBtn}>작성하기</button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default qna_board;
