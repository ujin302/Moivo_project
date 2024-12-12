import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import styles from "../../assets/css/Payment-success.module.css";
import { PATH } from "../../../scripts/path";

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const cartItems = searchParams.get("cartItems");
  const customerName = searchParams.get("customerName");
  const orderName = searchParams.get("orderName");
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const addr = searchParams.get("addr");
  const tel = searchParams.get("tel");
  const [emailSent, setEmailSent] = useState(false); // 이메일 전송 여부 상태 추가
  const recipientEmail = "jomin5151@gmail.com"; // 배송시킨 고객 이메일 주소
  const deliverystatus = "결제완료";

  if (!paymentKey || !orderId) {
    return <div>결제 정보가 올바르지 않습니다. 고객센터로 문의해주세요.</div>;
  }

  useEffect(() => {
    if (!emailSent) { // 이메일이 이미 전송되지 않은 경우에만 실행
      const sendEmail = async () => {
        try {
          const response = await fetch(`${PATH.SERVER}/api/mail/success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              toAddress: recipientEmail, // 받는 사람 이메일
              orderId: orderId, // 주문번호
              customerName: customerName, // 결제자
              orderName: orderName, // 상품 이름
              amount: amount, // 결제 금액
              addr: addr, // 배송지
              deliverystatus: deliverystatus, //배송현황
            }),
          });

          if (response.ok) {
            console.log("이메일 발송 성공");
            setEmailSent(true); // 이메일 전송 성공 시 상태 업데이트
          } else {
            console.error("이메일 발송 실패");
          }
        } catch (error) {
          console.error("이메일 발송 중 오류 발생", error);
        }
      };

      sendEmail();
    }
  }, [emailSent, orderId, customerName, orderName, amount, addr]);

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
                <td className={styles.column2}>배송지</td>
                <td className={styles.column2}>{addr}</td>
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
