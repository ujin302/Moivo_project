import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 Hook
import styles from "../../assets/css/Payment.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const payment = () => {
  const [orderStatus, setOrderStatus] = useState(null); // 결제 상태
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택한 쿠폰
  const [deliveryAddress, setDeliveryAddress] = useState(""); // 배송지
  const navigate = useNavigate();

  const [cartItems] = useState([
    { id: 1, name: "Angel wing tee", price: 62000, quantity: 1, image: "../image/only1.jpg" },
    { id: 2, name: "Ruffle baggy jeans", price: 129000, quantity: 2, image: "../image/only2.jpg" },
  ]);

  const coupons = [
    { id: 1, name: "5% 할인", discount: 0.05 },
    { id: 2, name: "10,000원 할인", discount: 10000 },
  ];

  // 임의의 배송지 데이터 불러오기
  useEffect(() => {
    // 실제로는 API 호출로 불러올 수 있음
    setDeliveryAddress("서울특별시 강남구 테헤란로 123");
  }, []);

  const handlePayment = () => {
    // 결제 페이지로 리다이렉트
    navigate("/payment-method", {
      state: { cartItems, finalAmount },
    });
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

            {/* 배송지 */}
            <div className={styles.deliveryAddress}>
              <label>배송지:</label>
              <input
                type="text"
                value={deliveryAddress}
                readOnly
                className={styles.inputField}
              />
            </div>

            {/* 결제 버튼 */}
            <button className={styles.payButton} onClick={handlePayment}>
              결제하기
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default payment;
