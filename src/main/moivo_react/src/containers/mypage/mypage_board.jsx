import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/css/Mypage_board.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const mypage_board = () => {
  const reviews = [
    {
      type: "문의",
      title: "Ruffle baggy jeans - 재고 여부",
      content: "M를 다시 입고할 계획이 있나요?",
      date: "2024-11-10",
      answer: "네, 중간 사이즈는 다음 주에 다시 입고될 예정입니다. 기대해 주세요!",
    },
    {
      type: "문의",
      title: "Classic pink logo top - 배송 여부",
      content: "제가 이번주 금요일에 이 옷 입어야되는데 출발했을까요?!?",
      date: "2024-11-12",
      answer: "저희가 확인한 결과 재고처 사정으로 인해 입고가 지연될 것 같습니다 ㅠㅠ",
    },
    {
      type: "문의",
      title: "Vintage leather jacket - 가격 문의",
      content: "빈티지 가죽 자켓 너무 비싸요 ! 할인은 없나요?",
      date: "2024-11-20",
      answer: "죄송하지만, 현재 빈티지 가죽 자켓은 세일 중이 아닙니다.",
    },
  ];

  // 답변 표시 여부 관리 상태
  const [showAnswer, setShowAnswer] = useState(
    new Array(reviews.length).fill(false) // 모든 답변은 기본적으로 숨겨져 있음
  );

  // 답변 토글 함수
  const toggleAnswer = (index) => {
    setShowAnswer((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index]; // 해당 문의 항목의 답변 토글
      return newState;
    });
  };

  return (
    <div className={styles.reviewPage}>
      <Banner />
      {/* 타이틀 */}
      <div className={styles.title}>MY INQUIRIES</div>

      {/* 문의 리스트 */}
      <div className={styles.reviewList}>
        {reviews.map((inquiry, index) => (
          <div key={index} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewType}>{inquiry.type}</span>
              <span className={styles.reviewDate}>{inquiry.date}</span>
            </div>
            <div className={styles.reviewTitle} onClick={() => toggleAnswer(index)}>
              {inquiry.title}
            </div>
            <div className={styles.reviewContent}>{inquiry.content}</div>

            {/* 답변 토글 */}
            {showAnswer[index] && (
              <div className={styles.adminAnswer}>
                <div className={styles.answerTitle}>관리자의 답변:</div>
                <div className={styles.answerContent}>{inquiry.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 메뉴로 돌아가기 */}
      <div className={styles.backToMenu}>
        <Link to="/mypage" className={styles.backLink}>
          My Page
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default mypage_board;
