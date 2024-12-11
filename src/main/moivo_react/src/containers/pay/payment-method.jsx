import React, { useEffect, useState } from "react";
import styles from "../../assets/css/order.module.css";
import { useLocation } from "react-router-dom";

//상품의 주문번호
const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const PaymentMethod = () => {
  const location = useLocation();
  const { userInfo, cartItems, totalPrice } = location.state;
  const [ready, setReady] = useState(false);
  const [customer, setCustomerName] = useState(null);
  const [orderName, setOrderName] = useState(null);
  const [widgets, setWidgets] = useState(null);
  const [addr, setAddr] = useState(null);
  const [tel, setTel] = useState(null);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: totalPrice, // 결제할 금액 설정
  });

  // 알파벳 순서로 정렬 후 가장 앞 상품 이름 선택
  useEffect(() => {
    const sortedItems = [...cartItems].sort((a, b) => a.name.localeCompare(b.name));
    const mainItemName = sortedItems[0].name; // 첫 번째 상품 이름
    const otherItemsCount = cartItems.length - 1; // 나머지 상품 개수

    // 주문 이름 설정
    setOrderName(
      otherItemsCount > 0
        ? `${mainItemName} 외 ${otherItemsCount}건`
        : mainItemName
    );
  }, [cartItems]);

  //주문자 
  useEffect(() => {
    setCustomerName(userInfo.name);
  },[]);

  //전화번호
  useEffect(() => {
    setTel(userInfo.tel);
  },[]);

  //주소
  useEffect(() => {
    setAddr("(" + userInfo.zipcode + ")" + userInfo.addr1 + userInfo.addr2);
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
                  customerName: customer, // 고객명
                  customerEmail: userInfo.email, // 고객 이메일
                  successUrl: `${window.location.origin}/payment-success?customerName=${encodeURIComponent(customer)}
                  &orderName=${encodeURIComponent(orderName)}
                  &addr=${encodeURIComponent(addr)}
                  &tel=${encodeURIComponent(tel)}
                  &cartItems=${encodeURIComponent(cartItems)}
                  &amount=${amount.value}`,
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
