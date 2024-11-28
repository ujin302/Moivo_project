import React from "react";
import { useSearchParams } from "react-router-dom";

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
      <h2>결제가 완료되었습니다!</h2>
      <p>결제자: {customerName}</p>
      <p>상품 이름: {orderName}</p>
      <p>결제 금액: {amount}</p>
      <p>주문 번호: {orderId}</p>
      <p>결제 키: {paymentKey}</p>
    </div>
  );
};

export default SuccessPage;
