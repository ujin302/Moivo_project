import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/Mypage_profile.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const MypageProfile = () => {
    const [userInfo, setUserInfo] = useState(null); // 사용자 정보 저장
    const [formData, setFormData] = useState({
        userId: "",
        pwd: "",
        confirmPassword: "",
        name: "",
        gender: "male",
        postalCode: "",
        addr1: "",
        addr2: "",
        tel: "",
        email: "",
        height: "",
        weight: "",
        coupon: "",
    });
    const navigate = useNavigate();

    // Fetch user info when the component mounts
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        //const userSeq = sessionStorage.getItem("userSeq");

        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user");
            return;
        }

        const id = 8;
        // Example of fetching user info from an API
        fetch(`http://localhost:8080/api/user/mypage/info/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // 인증 토큰 전달
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("사용자 정보를 가져오지 못했습니다.");
                }
                return response.json();
            })
            .then((data) => {
                setUserInfo(data);
                setFormData({
                    userId: data.userId,
                    pwd: data.pwd,
                    confirmPassword: data.pwd, 
                    name: data.name,
                    gender: data.gender,
                    zipcode: data.zipcode,
                    addr1: data.addr1,
                    addr2: data.addr2,
                    tel: data.tel,
                    email: data.email,
                    height: data.height,
                    weight: data.weight,
                    coupon: data.coupons
                });
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
                alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
            });
    }, [navigate]);
    console.log(userInfo);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
            return;
        }
        alert("회원정보가 수정되었습니다.");
    };

    const handleCancel = () => {
        setFormData({
            userId: userInfo?.userId || "",
            pwd: userInfo?.pwd || "",
            confirmPassword: userInfo?.pwd || "",
            name: userInfo?.name || "",
            gender: userInfo?.gender || "male",
            zipcode: userInfo?.zipcode || "",
            addr1: userInfo?.addr1 || "",
            addr2: userInfo?.addr2 || "",
            tel: userInfo?.tel || "",
            email: userInfo?.email || "",
            height: userInfo?.height || "",  // height 값이 없으면 빈 문자열로 처리
            weight: userInfo?.weight || "",  // weight 값도 마찬가지로 빈 문자열 처리
        });
        alert("수정이 취소되었습니다.");
    };

    const handleDeleteAccount = () => {
        alert("회원 탈퇴가 완료되었습니다.");
    };

    const handleFindPostalCode = () => {
        alert("우편번호 찾기 기능은 준비 중입니다."); // 추후 외부 API 연동 가능
    };

    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };
    
    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div>
            <div>
                <Banner />
                <div className={styles.profileContainer}>
                    
                    <div className={styles.pageName}>PROFILE</div>

                    <button className={styles.deleteButton} onClick={handleDeleteAccount}>
                        회원 탈퇴
                    </button>
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
                    <form className={styles.profileForm} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <label>ID</label>
                            <input className={styles.inputtext} type="text" name="userId" value={formData.userId} onChange={handleChange} disabled />
                        </div>
                        <div className={styles.formRow}>
                            <label>PASSWORD</label>
                            <input className={styles.inputtext} type="password" name="pwd" value={formData.pwd} onChange={handleChange} />
                        </div>
                        <div className={styles.formRow}>
                            <label>CONFIRM PASSWORD</label>
                            <input
                                className={styles.inputtext}
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>NAME</label>
                            <input className={styles.inputtext} type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className={styles.formRow}>
                            <label>GENDER</label>
                            <div className={styles.genderContainer}>
                                <label>
                                    <input
                                        className={styles.inputtext}
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === "male"}
                                        onChange={handleChange}
                                    />
                                    남성
                                </label>
                                <label>
                                    <input
                                        className={styles.inputtext}
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === "female"}
                                        onChange={handleChange}
                                    />
                                    여성
                                </label>
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <label>ADDRESS</label>
                            <div className={styles.addressContainer}>
                                <div className={styles.zipcode}>
                                    <input
                                        type="text"
                                        name="zipcode"
                                        value={formData.zipcode}
                                        onChange={handleChange}
                                        placeholder="우편번호"
                                    />
                                    <button
                                        type="button"
                                        className={styles.postalCodeButton}
                                        onClick={handleFindPostalCode}
                                    >
                                        우편번호 찾기
                                    </button>
                                </div>
                                <input
                                    className={styles.inputtext}
                                    type="text"
                                    name="addr1"
                                    value={formData.addr1}
                                    onChange={handleChange}
                                    placeholder="기본 주소"
                                />
                                <input
                                    className={styles.inputtext}
                                    type="text"
                                    name="addr2"
                                    value={formData.addr2}
                                    onChange={handleChange}
                                    placeholder="상세 주소"
                                /> 
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <label>PHONE</label>
                            <div className={styles.phoneRow}>
                                <input
                                    className={styles.inputtext}
                                    type="text"
                                    name="tel"
                                    value={formData.tel}
                                    onChange={handleChange}
                                    maxLength="12"
                                />     
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <label>EMAIL</label>
                            <input
                                className={styles.inputtext}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ color: "#2f2e2c" }}
                            />
                        </div>
                            <div className={styles.heightWeightRow}>
                                <label htmlFor="height">HEIGHT (cm):</label>
                                <input 
                                    className={styles.height}
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    placeholder="예: 170"
                                    onChange={handleChange}
                                />
                                <br/>
                                <label htmlFor="weight">WEIGHT (kg):</label>
                                <input
                                    className={styles.weight}
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    placeholder="예: 100"
                                    onChange={handleChange}
                                />
                            </div>            
                        <div className={styles.buttonRow}>
                            <button type="submit" className={styles.submitButton}>
                                회원정보 수정
                            </button>
                            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                                취소
                            </button>
                        </div>
                    </form>
                    <div className={styles.bottomBar}></div>
                        <Link to="/mypage" className={styles.backLink}>
                            Go Back to MyPage
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
    );
};

export default MypageProfile;