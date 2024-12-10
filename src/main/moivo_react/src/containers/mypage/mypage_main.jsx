import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/Mypage.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from '../../../scripts/path';


const MypageMain = () => {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 저장
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Access Token:", token);
    
    if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/user");
        return;
    }

    // 토큰 디코딩 (jwt-decode 없이)
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const id = decodedPayload.id;  //토큰에 있는 id 추출
    console.log("User ID:", id);

    // API 호출
    fetch(`${PATH.SERVER}/api/user/mypage/info/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("사용자 정보를 가져오지 못했습니다.");
        }
        return response.json();
      })
      .then((data) => {
        setUserInfo(data); // 사용자 정보 상태에 저장
        console.log("사용자 정보:" + data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
      });
  }, [navigate]);

  const [startIndex, setStartIndex] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);

  const [showCouponTooltip, setShowCouponTooltip] = useState(false);
  
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const coupons = [
    { name: "10% 할인쿠폰", description: "최대 10만원 할인" },
    { name: "무료 배송 쿠폰", description: "주문 금액 상관없이" },
    { name: "5천원 할인쿠폰", description: "최소 5만원 이상 구매 시" },
  ];

  const handleCouponMouseEnter = () => {
    setShowCouponTooltip(true);
  };

  const handleCouponMouseLeave = () => {
    setShowCouponTooltip(false);
  };


  const productList = [
    { image: "../image/only1.jpg", name: "Angel wing tee", price: "KRW 62,000" },
    { image: "../image/only2.jpg", name: "Ruffle baggy jeans", price: "KRW 129,000" },
    { image: "../image/only3.jpg", name: "Hailey cardigan", price: "KRW 105,000" },
    { image: "../image/only4.jpg", name: "Olive flared skirt", price: "KRW 73,000" },
    { image: "../image/only5.jpg", name: "Classic pink logo top", price: "KRW 78,000" },
    { image: "../image/only6.jpg", name: "Lace up cargo pants", price: "KRW 78,000" },
  ];

  const maxIndex = productList.length - 3; // 화면에 3개씩 표시

  // 좌측 화살표 클릭 시, 시작 인덱스 감소
  const handleLeftArrowClick = () => {
    setStartIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : maxIndex));
  };

  // 우측 화살표 클릭 시, 시작 인덱스 증가
  const handleRightArrowClick = () => {
    setStartIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
  };

  // 자동 슬라이드 기능 구현
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex < maxIndex ? prevIndex + 1 : 0));
    }, 3000); // 3초마다 자동 슬라이드

    // 컴포넌트 언마운트 시 인터벌 제거
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <div>
      <div className={styles.memberFrame}>
        <Banner/>
        {/* 타이틀 */}
        <div className={styles.title}>MY ACCOUNT</div>

        {/* 멤버십 박스 */}
        <div className={styles.membershipBox}>
          <div className={styles.membershipImage}>
            <img src="../image/level5.png" alt="Profile" />
          </div>
          <div>
            <div className={styles.membershipInfo}>
                {userInfo ? (
                  <>
                    {userInfo.name}님의 멤버십 등급은 [ {userInfo.grade} ]입니다.
                    <br />
                    LV.5 까지 남은 구매금액은 KRW 100,000원입니다.
                    <br />
                    <br />
                    키: <strong>{userInfo.height}cm &nbsp;</strong>
                    몸무게: <strong>{userInfo.weight}kg</strong>
                  </>
                ) : (
                  "사용자 정보를 불러오는 중입니다..."
                )}
              </div>
            <div className={styles.couponSection}>
              <div className={styles.point}>POINT: <strong>5000</strong></div>
                <div className={styles.coupon}>
                    COUPON: &nbsp;
                    {userInfo && userInfo.coupons ? (
                      userInfo.coupons.map((coupon, index) => (
                        <strong key={index}>{coupon.name}</strong>
                      ))
                    ) : (
                      "쿠폰 정보를 불러오는 중입니다..."
                    )}
                </div>
              </div>
            </div>
            {/* 아이콘 영역 (우측 상단에 배치) */}
            <div 
              className={styles.tooltipIcon} 
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <img src="../image/info.png" alt="Info Icon"/>
              {showTooltip && (
                <div className={styles.tooltip}>
                  <p>
                    LV 1 : 일반회원<br />
                    LV 2: 월 구매 10만원 이상<br />
                    LV 3: 월 구매 30만원 이상<br />
                    LV 4: 월 구매 50만원 이상<br />
                    LV 5: 월 구매 70만원 이상<br /><br/>
                    <strong>LV 2 혜택:</strong> LV2 전용 15% 할인 쿠폰<br />
                    <strong>LV 3 혜택:</strong> LV3 전용 20% 할인 쿠폰<br />
                    <strong>LV 4 혜택:</strong> LV4 전용 25% 할인 쿠폰<br />
                    <strong>LV 5 혜택:</strong> LV5 전용 30% 할인 쿠폰<br />
                   
                  </p>
                </div>
              )}
            </div>
          </div>



        {/* 좌우 배치 영역 */}
        <div className={styles.contentWrapper}>
          {/* ONLY FOR YOU */}
          <div className={styles.onlyForYouBox}>
            <div className={styles.onlyForYou}>ONLY FOR YOU</div>
            {/* 좌우 화살표 버튼 */}
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={handleLeftArrowClick}>
            <img src="../image/arrow.png" alt="Left Arrow" />
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={handleRightArrowClick}>
            <img src="../image/arrow.png" alt="Right Arrow" />
          </button>

          <div className={styles.productList}>
            {productList.slice(startIndex, startIndex + 3).map((product, index) => (
              <div key={index} className={styles.product}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productText}>
                  {product.name} <br />
                  <span className={styles.price}>{product.price}</span>
                </div>
              </div>
            ))}
          </div>

            {/* 하단 바 */}
            <div className={styles.bottomBar}></div>
            
          </div>

          {/* 오른쪽 메뉴 */}
          <div className={styles.menuWrapper}>
            <div className={styles.crossLine}>
              <div className={styles.horizontal}></div>
              <div className={styles.vertical}></div>
            </div>
              <Link to="/mypage/profile" className={styles.menuItem}>
                <img src="../image/profile.png" alt="Profile" />
                PROFILE
              </Link>
              <Link to="/mypage/order" className={styles.menuItem}>
                <img src="../image/order.png" alt="Order" />
                ORDER
              </Link>
              <Link to="/mypage/board" className={styles.menuItem}>
                <img src="../image/board.png" alt="Board" />
                BOARD
              </Link>
              <Link to="/mypage/wish" className={styles.menuItem}>
                <img src="../image/wish.png" alt="Wishlist" />
                WISHLIST
              </Link>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MypageMain;
