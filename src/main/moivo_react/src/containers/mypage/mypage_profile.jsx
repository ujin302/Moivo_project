import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../assets/css/Mypage_profile.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const MypageProfile = () => {
    const [userInfo, setUserInfo] = useState(null); // 사용자 정보 저장
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        confirmPassword: "",
        name: "",
        gender: "male",
        postalCode: "",
        address: "",
        detailedAddress: "",
        phone1: "",
        phone2: "",
        phone3: "",
        email: "",
        height: "",
        weight: "",
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
                    id: data.id,
                    password: data.password,
                    confirmPassword: data.password, // Assuming the password should match
                    name: data.name,
                    gender: data.gender,
                    postalCode: data.postalCode,
                    address: data.address,
                    detailedAddress: data.detailedAddress,
                    phone1: data.phone1,
                    phone2: data.phone2,
                    phone3: data.phone3,
                    email: data.email,
                    height: data.height,
                    weight: data.weight,
                });
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
                alert("사용자 정보를 가져오는 중 오류가 발생했습니다.");
            });
    }, [navigate]);

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
            id: userInfo?.id || "",
            password: userInfo?.password || "",
            confirmPassword: userInfo?.password || "",
            name: userInfo?.name || "",
            gender: userInfo?.gender || "male",
            postalCode: userInfo?.postalCode || "",
            address: userInfo?.address || "",
            detailedAddress: userInfo?.detailedAddress || "",
            phone1: userInfo?.phone1 || "",
            phone2: userInfo?.phone2 || "",
            phone3: userInfo?.phone3 || "",
            email: userInfo?.email || "",
            height: data.height || "", 
            weight: data.weight || "", 
        });
        alert("수정이 취소되었습니다.");
    };

    const handleDeleteAccount = () => {
        alert("회원 탈퇴가 완료되었습니다.");
    };

    const handleFindPostalCode = () => {
        alert("우편번호 찾기 기능은 준비 중입니다."); // 추후 외부 API 연동 가능
    };

    return (
        <div>
            <div>
                <div className={styles.profileContainer}>
                    <Banner />
                    <div className={styles.pageName}>PROFILE</div>

                    <button className={styles.deleteButton} onClick={handleDeleteAccount}>
                        회원 탈퇴
                    </button>
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
                                        VIP까지 남은 구매금액은 KRW {userInfo.remainingAmount}입니다.
                                    </>
                                ) : (
                                    "사용자 정보를 불러오는 중입니다..."
                                )}
                            </div>
                            <div className={styles.pointCoupon}>POINT : {userInfo?.points || 0} | COUPON : {userInfo?.coupons || 0}</div>
                        </div>
                    </div>
                    <form className={styles.profileForm} onSubmit={handleSubmit}>
                        <div className={styles.formRow}>
                            <label>ID</label>
                            <input className={styles.inputtext} type="text" name="id" value={formData.id} onChange={handleChange} disabled />
                        </div>
                        <div className={styles.formRow}>
                            <label>PASSWORD</label>
                            <input className={styles.inputtext} type="password" name="password" value={formData.password} onChange={handleChange} />
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
                                <div className={styles.postalCodeContainer}>
                                    <input
                                        className={styles.inputtext}
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
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
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="기본 주소"
                                />
                                <input
                                    className={styles.inputtext}
                                    type="text"
                                    name="detailedAddress"
                                    value={formData.detailedAddress}
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
                                    name="phone1"
                                    value={formData.phone1}
                                    onChange={handleChange}
                                    maxLength="3"
                                />
                                <span>-</span>
                                <input
                                    className={styles.inputtext}
                                    type="text"
                                    name="phone2"
                                    value={formData.phone2}
                                    onChange={handleChange}
                                    maxLength="4"
                                />
                                <span>-</span>
                                <input
                                    className={styles.inputtext}
                                    type="text"
                                    name="phone3"
                                    value={formData.phone3}
                                    onChange={handleChange}
                                    maxLength="4"
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
                                    placeholder="예: 170"
                                />
                                <br/>
                                <label htmlFor="weight">WEIGHT (kg):</label>
                                <input
                                    className={styles.weight}
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    placeholder="예: 100"
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