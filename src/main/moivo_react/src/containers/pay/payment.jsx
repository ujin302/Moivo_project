import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 Hook
import styles from "../../assets/css/Payment.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from "../../../scripts/path"; // API 경로 설정

const Payment = () => {
  const [orderStatus, setOrderStatus] = useState(null); // 결제 상태
  const [selectedCoupon, setSelectedCoupon] = useState(null); // 선택한 쿠폰
  const [deliveryAddress, setDeliveryAddress] = useState(""); // 배송지
  const [payerName, setPayerName] = useState(""); // 결제자 이름
  const [phoneNumber, setPhoneNumber] = useState(""); // 결제자 전화번호
  const [isAddressEditable, setIsAddressEditable] = useState(false); // 배송지 수정 가능 여부
  const [coupon, setCoupon] = useState(null); // 사용자 쿠폰 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  const [cartItems] = useState([
    { id: 1, name: "Angel wing tee", price: 62000, quantity: 1, image: "../image/only1.jpg" },
    { id: 2, name: "Ruffle baggy jeans", price: 129000, quantity: 2, image: "../image/only2.jpg" },
  ]);

  // 사용자 정보 및 쿠폰 데이터 불러오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      alert("로그인이 필요합니다.");
      navigate("/user");
      return;
    }

    const fetchData = async () => {
      try {
        // 사용자 정보 API 호출
        const response = await fetch(`${PATH.SERVER}/api/user/mypage/info/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("사용자 정보를 가져오지 못했습니다.");
        const data = await response.json();

        // 사용자 데이터 설정
        setPayerName(data.name || "");
        setPhoneNumber(data.tel || "");
        setDeliveryAddress(`${data.addr1 || ""} ${data.addr2 || ""}`.trim());
        setCoupon(data.coupons || null);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handlePayment = () => {
    if (!payerName || !phoneNumber || !deliveryAddress) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    navigate("/payment-method");
  };

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount =
    selectedCoupon && typeof selectedCoupon.discount === "number"
      ? selectedCoupon.discount < 1
        ? totalAmount * selectedCoupon.discount
        : selectedCoupon.discount
      : 0;

  const finalAmount = totalAmount - discount + 3000;

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 상태 표시
  }

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

            {/* 결제자 정보 */}
            <div className={styles.payerInfo}>
              <label>결제자 이름:</label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className={styles.inputField}
                placeholder="이름을 입력하세요"
              />
              <label>전화번호:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.inputField}
                placeholder="전화번호를 입력하세요"
              />
            </div>

            {/* 쿠폰 정보 */}
            <div className={styles.couponContainer}>
              <label>사용 가능한 쿠폰:</label>
              <div className={styles.couponValue}>
                {coupon ? <strong>{coupon.name}</strong> : "쿠폰 없음"}
              </div>
            </div>

            {/* 배송지 */}
            <div className={styles.deliveryAddress}>
              <label>배송지:</label>
              {isAddressEditable || !deliveryAddress ? (
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={styles.inputField}
                  placeholder="배송지를 입력하세요"
                />
              ) : (
                <input
                  type="text"
                  value={deliveryAddress}
                  readOnly
                  className={styles.inputField}
                />
              )}
              <button
                className={styles.editButton}
                onClick={() => setIsAddressEditable((prev) => !prev)}
              >
                {isAddressEditable ? "완료" : "수정"}
              </button>
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

export default Payment;
