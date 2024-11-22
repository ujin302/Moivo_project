import React from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/css/Mypage_board.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const mypage_board = () => {
  const reviews = [
    {
      type: "Review",
      title: "Angel wing tee - Great quality!",
      content: "The material is super soft, and the fit is perfect. Highly recommend!",
      date: "2024-11-15",
    },
    {
      type: "Inquiry",
      title: "Ruffle baggy jeans - Stock availability?",
      content: "Are you planning to restock the medium size soon?",
      date: "2024-11-10",
    },
    {
      type: "Review",
      title: "Classic pink logo top - Beautiful!",
      content: "Absolutely love the design. It's very comfortable and stylish.",
      date: "2024-11-05",
    },
    
  ];

  return (
    <div className={styles.reviewPage}>
      <Banner />
      {/* 타이틀 */}
      <div className={styles.title}>MY REVIEWS & INQUIRIES</div>

      {/* 리뷰 & 문의 리스트 */}
      <div className={styles.reviewList}>
        {reviews.map((review, index) => (
          <div key={index} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <span className={styles.reviewType}>{review.type}</span>
              <span className={styles.reviewDate}>{review.date}</span>
            </div>
            <div className={styles.reviewTitle}>{review.title}</div>
            <div className={styles.reviewContent}>{review.content}</div>
          </div>
        ))}
      </div>

      {/* 메뉴로 돌아가기 */}
      <div className={styles.backToMenu}>
        <Link to="/mypage" className={styles.backLink}>
          Back to My Page
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default mypage_board;
