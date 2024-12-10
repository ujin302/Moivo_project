import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import styles from "../../assets/css/Payment-success.module.css";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const customerName = searchParams.get("customerName");
  const orderName = searchParams.get("orderName");
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  if (!paymentKey || !orderId || !amount) {
    return <div>결제 정보가 올바르지 않습니다. 고객센터로 문의해주세요.</div>;
  }

  return (
    <div>
      <Banner />
      <div className={styles.main_container}>
        <div className={styles.payment_container}>
          <h2 className={styles.title}>결제 완료</h2>
          <table className={styles.payment_table}>
            <thead>
              <tr>
                <th className={styles.column2}>결제 정보</th>
                <th className={styles.column2}>내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.column2}>주문 번호</td>
                <td className={styles.column2}>{orderId}</td>
              </tr>
              <tr>
                <td className={styles.column2}>결제자</td>
                <td className={styles.column2}>{customerName}</td>
              </tr>
              <tr>
                <td className={styles.column2}>상품 이름</td>
                <td className={styles.column2}>{orderName}</td>
              </tr>
              <tr>
                <td className={styles.column2}>결제 금액</td>
                <td className={styles.column2}>{amount} 원</td>
              </tr>
              <tr>
                <td className={styles.column2}>결제 키</td>
                <td className={styles.column2}>{paymentKey}</td>
              </tr>
            </tbody>
          </table>
          <Link to="/mypage/order" className={styles.menuItem}>
            <span>ORDER</span>
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;
