import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import styles from "../../assets/css/Payment-success.module.css";
import axios from "axios";
import { PATH } from "../../../scripts/path";

const SuccessPage = () => {
  const { token } = localStorage.getItem("accessToken");
  const [searchParams] = useSearchParams();
  const paymentData = JSON.parse(decodeURIComponent(searchParams.get("paymentData"))); // 결제 정보
  const paymentDetailList = JSON.parse(decodeURIComponent(searchParams.get("paymentDetailList"))); // 결제 상품
  const isCartItem = searchParams.get("isCartItem"); // 장바구니 상품 여부
  const orderName = searchParams.get("orderName"); // 상품 이름
  const paymentKey = searchParams.get("paymentKey"); // 결제 확인용
  const orderId = searchParams.get("orderId");
  const [payment, setPayment] = useState(paymentData);

  const paymentInfo = async () => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        // headers['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1amluIiwidXNlcklkIjoidWppbiIsImlkIjoxOCwid2lzaElkIjo1LCJjYXJ0SWQiOjQsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MzM5NzA3NDQsImV4cCI6MTczMzk3MTY0NH0.sb7odEe0DiYdhNaOSZsu4G2ZCZ_rQDaOaB1ZCdtdPh8`;
      }

      // 토스 코드 저장
      setPayment(prevState => ({
        ...prevState,  // 기존 상태를 복사 (discount 값 유지)
        tosscode: orderId
      }));
      
      // 결제 내역 저장
      await axios.post(`${PATH.SERVER}/api/user/payment`, {
        headers,
        params: {
          payment: JSON.stringify(payment), // 결제 정보
          paymentDetail: JSON.stringify(paymentDetailList), // 결제 품목
          isCartItem: isCartItem.toString // 장바구니 상품
        }
      });

      console.log('결제 내역 저장 성공');
      

    } catch (error) {
      if (error.response?.status === 401) {
        console.error("인증 오류:", error);
      } else {
        console.error("결제 상품 저장 중 오류 발생: ", error);
      }
    }
  };
  
  useEffect(() => {
    if (!paymentKey || !orderId) {
      return <div>결제 정보가 올바르지 않습니다. 고객센터로 문의해주세요.</div>;
    }
    console.log(payment);
    console.log(paymentDetailList);
    console.log(isCartItem+'');
    console.log(orderName);
    console.log(searchParams.get("orderName"));

    // 서버에 데이터 전송
    paymentInfo();
  }, [])

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
                <td className={styles.column2}>{paymentData.name}</td>
              </tr>
              <tr>
                <td className={styles.column2}>상품 이름</td>
                <td className={styles.column2}>{orderName}</td>
              </tr>
              <tr>
                <td className={styles.column2}>결제 금액</td>
                <td className={styles.column2}>{paymentData.totalPrice} 원</td>
              </tr>
              <tr>
                <td className={styles.column2}>배송지</td>
                <td className={styles.column2}>{"(" + paymentData.zipcode + ")" + paymentData.addr1 + " " + paymentData.addr2}</td>
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
