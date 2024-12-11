import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/css/Payment.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from "../../../scripts/path";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    zipcode: "",
    addr1: "",
    addr2: "",
    coupon: "",
  });
  const [coupons, setCoupons] = useState([]); // 쿠폰 리스트 상태 추가
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      alert("로그인이 필요합니다.");
      navigate("/user");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${PATH.SERVER}/api/user/mypage/info/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setUserInfo(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            tel: data.tel || "",
            zipcode: data.zipcode || "",
            addr1: data.addr1 || "",
            addr2: data.addr2 || "",
            coupon: "",
          });
          setCoupons(data.coupons || []); // 쿠폰 정보 설정
        }
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 결제 금액 계산 함수 (할인 반영)
  const getDiscountedTotal = () => {
    if (!formData.coupon) return totalPrice;

    // 선택한 쿠폰을 찾고, 할인 적용
    const selectedCoupon = coupons.find(coupon => coupon.name === formData.coupon);
    if (selectedCoupon) {
      const discountAmount = (totalPrice * selectedCoupon.discountValue) / 100;
      console.log(selectedCoupon);
      console.log(selectedCoupon.discountValue);
      return totalPrice - discountAmount;
    }
    return totalPrice;
  };

  // 상품별 할인된 가격 계산
  const calculateDiscountedPrice = (price) => {
    if (!formData.coupon) return price; // 쿠폰 선택 안 된 경우 원래 가격 반환
    const selectedCoupon = coupons.find(coupon => coupon.name === formData.coupon);
    if (selectedCoupon) {
      const discountValue = selectedCoupon.discountValue; // 할인율
      return price - (price * discountValue) / 100;
    }
    return price;
  };

  const handlePayment = () => {
    if (!formData.name || !formData.tel || !formData.zipcode || !formData.addr1) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
  
    // 사용자가 입력한 정보와 카트 정보를 state로 전달하면서 payment-method로 이동
    navigate("/payment-method", {
      state: {
        userInfo: formData, // 결제자 정보(고객명 + 아이디 + 이메일 + 전화번호(추후결정) )
        cartItems: cartItems, // 상품 정보
        totalPrice: getDiscountedTotal(), // 할인된 금액으로 결제
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div>
      <Banner />
      <div className={styles.paymentFrame}>
        <div className={styles.title}>Your Payment</div>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <>
            <form className={styles.userForm2}>
              <div className={styles.formRow2}>
                <label>이름</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formRow2}>
                <label>전화번호</label>
                <input
                  type="text"
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formRow2}>
                <label>우편번호</label>
                <div className={styles.addressRow2}>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    required
                  />
                  <button type="button">우편번호 찾기</button>
                </div>
              </div>
              <div className={styles.formRow2}>
                <label>주소</label>
                <input
                  type="text"
                  name="addr1"
                  value={formData.addr1}
                  onChange={handleChange}
                  placeholder="기본 주소"
                  required
                />
                <input
                  type="text"
                  name="addr2"
                  value={formData.addr2}
                  onChange={handleChange}
                  placeholder="상세 주소"
                />
              </div>
              <div className={styles.formRow2}>
                <label>쿠폰</label>
                <select
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleChange}
                >
                  <option value="">쿠폰을 선택하세요</option>
                  {coupons.map((coupon) => (
                    <option key={coupon.id} value={coupon.name}>
                      {coupon.name} ({coupon.discountValue}% 할인)
                    </option>
                  ))}
                </select>
              </div>
            </form>
            {cartItems.length > 0 ? (
              <>
                <div className={styles.productList}>
                  {cartItems.map((item) => {
                    const discountedPrice = calculateDiscountedPrice(item.price);
                    return (
                      <div key={item.usercartId} className={styles.productItem}>
                        <img
                          src={item.img || "../image/default.jpg"}
                          alt={item.name}
                          className={styles.productImage}
                        />
                        <div className={styles.productDetails}>
                          <div className={styles.productName}>{item.name}</div>
                          <div className={styles.productPrice}>
                            {discountedPrice !== item.price ? (
                              <>
                                <span className={styles.originalPrice}>
                                  KRW {item.price.toLocaleString()}
                                </span>
                                <span className={styles.itemCount}> x {item.count}</span>
                                <br />
                                <span className={styles.discountedPrice}>
                                  KRW {discountedPrice.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className={styles.finalPrice}>
                                  KRW {item.price.toLocaleString()}
                                </span>
                                <span className={styles.itemCount}> x {item.count}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.paymentContainer}>
                  <div className={styles.paymentSummary}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>총 결제 금액:</span>
                      <span className={styles.summaryValue}>
                        KRW {getDiscountedTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button className={styles.payButton} onClick={handlePayment}>
                    결제하기
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.emptyPayment}>선택된 상품이 없습니다.</div>
            )}
          </>
        )}
        <div className={styles.bottomBar}></div>
        <Link to="/cart" className={styles.backLink}>
          Go Back to Cart
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
