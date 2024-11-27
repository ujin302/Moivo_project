import React, { useState } from "react";
import styles from "../../assets/css/Payment.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const payment = () => {
  const [orderStatus, setOrderStatus] = useState(null); // 결제 상태
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택한 쿠폰
  const [cartItems] = useState([
    { id: 1, name: "Angel wing tee", price: 62000, quantity: 1, image: "../image/only1.jpg" },
    { id: 2, name: "Ruffle baggy jeans", price: 129000, quantity: 2, image: "../image/only2.jpg" },
  ]);

  const coupons = [
    { id: 1, name: "5% 할인", discount: 0.05 },
    { id: 2, name: "10,000원 할인", discount: 10000 },
  ];

  const handlePayment = () => {
    // 결제 API 호출 시 결제 성공한 것처럼 처리
    setTimeout(() => {
      setOrderStatus("success");
    }, 1000);
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount =
    selectedCoupon && typeof selectedCoupon.discount === "number"
      ? selectedCoupon.discount < 1
        ? totalAmount * selectedCoupon.discount
        : selectedCoupon.discount
      : 0;

  const finalAmount = totalAmount - discount + 3000;

  return (
    <div>
      <Banner />
      <div className={styles.paymentFrame}>
        <div className={styles.title}>결제 확인</div>

        {/* 구매 상품 리스트 */}
        <div className={styles.productList}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.productItem}>
              <img src={item.image} alt={item.name} className={styles.productImage} />
              <div className={styles.productDetails}>
                <div className={styles.productName}>{item.name}</div>
                <div className={styles.productPrice}>
                  KRW {item.price.toLocaleString()} x {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 결제 총합 */}
        <div className={styles.paymentContainer}>
          <div className={styles.paymentDetails}>
            <div className={styles.paymentSummary}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>상품 금액:</span>
                <span className={styles.summaryValue}>KRW {totalAmount.toLocaleString()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>쿠폰 할인:</span>
                <span className={styles.summaryValue}>- KRW {discount.toLocaleString()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>배송비:</span>
                <span className={styles.summaryValue}>KRW 3,000</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>총 결제 금액:</span>
                <span className={styles.summaryValue}>
                  KRW {finalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* 쿠폰 선택 */}
            <div className={styles.couponContainer}>
              <label>사용 가능한 쿠폰:</label>
              <select
                className={styles.inputField}
                onChange={(e) =>
                  setSelectedCoupon(coupons.find((coupon) => coupon.id === Number(e.target.value)))
                }
              >
                <option value="">쿠폰을 선택하세요</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 배송지 입력 */}
            <div className={styles.deliveryAddress}>
              <label>배송지:</label>
              <input
                type="text"
                placeholder="배송지를 입력하세요."
                className={styles.inputField}
              />
            </div>

            {/* 결제 버튼 */}
            <button className={styles.payButton} onClick={handlePayment}>
              결제하기
            </button>
          </div>

          {/* 결제 상태 메시지 */}
          {orderStatus && (
            <div className={styles.orderStatus}>
              {orderStatus === "success" ? (
                <div className={styles.successMessage}>
                  결제가 완료되었습니다! 주문이 처리 중입니다.
                </div>
              ) : (
                <div className={styles.errorMessage}>결제 실패!</div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default payment;
