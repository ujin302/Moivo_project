import React, { useEffect, useState } from "react";
import styles from "../../assets/css/order.module.css";

//상품의 주문번호
const generateRandomString = () => window.btoa(Math.random()).slice(0, 20);
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const ProductOrder = () => {
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 100, // 결제할 금액 설정 (예: 100원)
  });

  useEffect(() => {
    const tossPayments = window.TossPayments(clientKey);
    const widgets = tossPayments.widgets({ customerKey: "ANONYMOUS" });
    setWidgets(widgets);
  }, []);

  useEffect(() => {
    const renderPaymentWidgets = async () => {
      if (widgets == null) {
        return;
      }

    /*
     * 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
     * renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
     * @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
     */
      await widgets.setAmount(amount);

      await Promise.all([
        /*
        * 결제창을 렌더링합니다.
        * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
        */
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          // 렌더링하고 싶은 결제 UI의 variantKey
          // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
          // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
          variantKey: "DEFAULT", // 기본 결제 UI
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          /*
          * 약관을 렌더링합니다.
          * @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
          */
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
                /*
                * 결제 요청
                * 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
                * 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
                * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
                */
                await widgets?.requestPayment({
                  orderId: generateRandomString(), // 고유 주문 ID
                  orderName: "토스 티셔츠 외 2건", // 상품명
                  customerName: "김토스", // 고객명
                  customerEmail: "customer123@gmail.com", // 고객 이메일
                  successUrl: window.location.origin + "/product-order-success",
                  failUrl: window.location.origin + "/Fproduct-order-fail",
                });
              } catch (error) {
                console.error("결제 실패:", error);
                //결제 실패 시 뒤로 가게 해야할 것 같음
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

export default ProductOrder;
