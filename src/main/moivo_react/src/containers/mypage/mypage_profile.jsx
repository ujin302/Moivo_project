import React, { useState } from 'react';
import styles from "../../assets/css/Mypage_profile.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const MypageProfile = () => {
    const [formData, setFormData] = useState({
        id: "sumin",
        password: "bitcamp123!@#",
        confirmPassword: "bitcamp123!@#",
        name: "전수민",
        gender: "male", // 성별 추가 (기본값: 남성)
        postalCode: "06134",
        address: "서울시 강남구 강남대로94길 20",
        detailedAddress: "6층 602호",
        phone1: "010",
        phone2: "4567",
        phone3: "0680",
        email: "wjstnal5@gmail.com",
    });

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
            id: "sumin",
            password: "bitcamp123!@#",
            confirmPassword: "bitcamp123!@#",
            name: "전수민",
            gender: "male",
            postalCode: "06134",
            address: "서울시 강남구 강남대로94길 20",
            detailedAddress: "6층 602호",
            phone1: "010",
            phone2: "4567",
            phone3: "0680",
            email: "wjstnal5@gmail.com",
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
                            전수민님의 멤버십 등급은 [GOLD]입니다.
                            <br />
                            VIP까지 남은 구매금액은 KRW 100,000원입니다.
                        </div>
                        <div className={styles.pointCoupon}>POINT : 5,000 | COUPON : 10</div>
                    </div>
                </div>
                <form className={styles.profileForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label>ID</label>
                        <input type="text" name="id" value={formData.id} onChange={handleChange} disabled />
                    </div>
                    <div className={styles.formRow}>
                        <label>PASSWORD</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div className={styles.formRow}>
                        <label>CONFIRM PASSWORD</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>NAME</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    {/* 성별 입력 필드 추가 */}
                    <div className={styles.formRow}>
                        <label>GENDER</label>
                        <div className={styles.genderContainer}>
                            <label>
                                <input
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
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="기본 주소"
                            />
                            <input
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
                                type="text"
                                name="phone1"
                                value={formData.phone1}
                                onChange={handleChange}
                                maxLength="3"
                            />
                            <span>-</span>
                            <input
                                type="text"
                                name="phone2"
                                value={formData.phone2}
                                onChange={handleChange}
                                maxLength="4"
                            />
                            <span>-</span>
                            <input
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
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ color: "#2f2e2c" }}
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
            </div>
            <Footer />
        </div>
    );
};

export default MypageProfile;
