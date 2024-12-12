import React, { useEffect, useState } from "react";
import styles from "../../assets/css/order.module.css";
import { useLocation, useNavigate } from "react-router-dom";

//상품의 주문번호
const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 결제 정보 추출
  const { paymentData, paymentDetailList, isCartItem } = location.state;
  const [paymentDetail, setPaymentDetail] = useState([]); // 결제 상품 추출
  const [orderName, setOrderName] = useState(null);
  // 토스 위젯 관련
  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: paymentData.totalPrice, // 결제할 금액 설정
  });

  useEffect(() => {
    // 알파벳 순서로 정렬 후 가장 앞 상품 이름 선택
    const sortedItems = [...paymentDetailList].sort((a, b) => a.name.localeCompare(b.name));
    const mainItemName = sortedItems[0].name; // 첫 번째 상품 이름
    const otherItemsCount = paymentDetailList.length - 1; // 나머지 상품 개수

    // 주문 이름 설정
    setOrderName(
      otherItemsCount > 0
        ? `${mainItemName} 외 ${otherItemsCount}건`
        : mainItemName
    );

    if(isCartItem) {
      const transformedDetails = paymentDetailList.map((item) => ({
        id: null, // 백엔드에서 자동 생성
        paymentId: null, // 결제 완료 후 백엔드에서 연관된 ID를 추가
        productId: item.productId, // 원본 데이터에서 productId 추출
        usercartId: item.usercartId, // 원본 데이터에서 usercartId 추출
        price: item.price * item.count, // 가격 계산 (단가 * 수량)
        count: item.count, // 수량 그대로 사용
        size: item.size // 사이즈 그대로 사용
      }));

      setPaymentDetail(transformedDetails); // 새로운 리스트 상태에 저장
    }
    console.log(mainItemName);
    console.log(otherItemsCount);

    console.log(isCartItem);
    console.log(paymentDetailList);
    console.log(paymentData);
    console.log(orderName);
    console.log(location.state);
    
  },[]);

  //토스 위젯
  useEffect(() => {
    const tossPayments = window.TossPayments(clientKey);
    const widgets = tossPayments.widgets({ customerKey: "ANONYMOUS" });
    setWidgets(widgets);
  }, []);

  //토스 위젯 2 결제
  useEffect(() => {
    const renderPaymentWidgets = async () => {
      if (widgets == null) {
        return;
      }
      await widgets.setAmount(amount);

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT", // 기본 결제 UI
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT", // 약관 UI
        }),
      ]);

      setReady(true);
    };

    renderPaymentWidgets();
  }, [widgets, amount]);

  return (
    <div className={`${styles.wrapper} ${styles["w-100"]}`}>
    <div className={`${styles["max-w-540"]} ${styles["w-100"]}`}>
      <div id="payment-method" className={styles["w-100"]} />
      <div id="agreement" className={styles["w-100"]} />
      <div className={`${styles["btn-wrapper"]} ${styles["w-100"]}`}>
        <button
          className={`${styles.btn} ${styles.primary} ${styles["w-100"]}`}
          onClick={async () => {
            try {
              await widgets?.requestPayment({
                orderId: generateRandomString(), // 고유 주문 ID
                orderName: orderName, // 상품명
                customerName: paymentData.name, // 고객명
                customerEmail: paymentData.email, // 고객 이메일
                successUrl: `${window.location.origin}/payment-success?customerName=${encodeURIComponent(paymentData.name)}
                &orderName=${encodeURIComponent(orderName)}
                &paymentData=${encodeURIComponent(JSON.stringify(paymentData))}
                &paymentDetailList=${encodeURIComponent(JSON.stringify(paymentDetail))}
                &isCartItem=${encodeURIComponent(isCartItem)}`,
                failUrl: `${window.location.origin}/payment-fail`,
              });
            } catch (error) {
              console.error("결제 실패:", error);
              navigate("/cart");
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  </div>
  );
};

export default PaymentMethod;
