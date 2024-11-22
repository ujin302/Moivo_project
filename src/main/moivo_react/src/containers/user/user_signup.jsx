import React, { useState } from "react";
import styles from '../../assets/css/user_sigup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import axios from "axios";

function user_signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    pwd: "",
    confirmPwd: "",
    name: "",
    postalCode: "",
    address: "",
    detailedAddress: "",
    phone1: "",
    phone2: "",
    phone3: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    id: "",
    pwd: "",
    confirmPwd: "",
    name: "",
    postalCode: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // ID validation
    if (!formData.id) {
      newErrors.id = "아이디를 입력해주세요.";
      isValid = false;
    }

    // Password validation
    if (!formData.pwd) {
      newErrors.pwd = "비밀번호를 입력해주세요.";
      isValid = false;
    }

    // Confirm Password validation
    if (formData.pwd !== formData.confirmPwd) {
      newErrors.confirmPwd = "비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요.";
      isValid = false;
    }

    // Address validation
    if (!formData.postalCode || !formData.address || !formData.detailedAddress) {
      newErrors.address = "주소를 모두 입력해주세요.";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone1 || !formData.phone2 || !formData.phone3) {
      newErrors.phone = "전화번호를 모두 입력해주세요.";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/user/join", {
        userId: formData.userId,
        pwd: formData.pwd,
        name: formData.name,
        email: formData.email,
      });
      alert("회원가입 성공!");
      navigate("/user");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  const handleFindPostalCode = () => {
    alert("우편번호 찾기 기능은 구현되어 있지 않습니다.");
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.pageName}>Sign Up</div>
      <div className={styles.signupDiv}>
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <span>ID</span>
            <input type="text" name="userId" value={formData.userId} onChange={handleChange} />
            <div className={styles.exception}>{errors.userId}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>PASSWORD</span>
            <input type="password" name="pwd" value={formData.pwd} onChange={handleChange} />
            <div className={styles.exception}>{errors.pwd}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>CONFIRM PASSWORD</span>
            <input type="password" name="confirmPwd" value={formData.confirmPwd} onChange={handleChange} />
            <div className={styles.exception}>{errors.confirmPwd}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>NAME</span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            <div className={styles.exception}>{errors.name}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>GENDER</span>
              <div className={styles.radioContainer}>
                <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange}/> Male
                <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange}/> Female
              </div>
                <div className={styles.exception}>{errors.gender}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>ADDRESS</span>
            <div className={styles.addressContainer}>
              <div className={styles.postalRow}>
                <input type="text" name="postalCode" placeholder="우편번호" value={formData.postalCode} onChange={handleChange} />
                <button type="button" onClick={handleFindPostalCode}>우편번호 찾기</button>
              </div>
              
              <div className={`${styles.formRow} ${styles.detailedAddress}`}>
                <input type="text" name="address" placeholder="기본 주소" value={formData.address} onChange={handleChange} />
              </div>
              <div className={`${styles.formRow} ${styles.detailedAddress}`}>
                <input type="text" name="detailedAddress" placeholder="상세 주소" value={formData.detailedAddress} onChange={handleChange} />
                <div className={styles.exception}>{errors.address}</div>
              </div>
            </div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>PHONE</span>
            <div className={styles.phoneRow}>
              <input type="text" name="phone1" placeholder="010" maxLength="3" value={formData.phone1} onChange={handleChange} />
              <p>-</p>
              <input type="text" name="phone2" placeholder="0000" maxLength="4" value={formData.phone2} onChange={handleChange} />
              <p>-</p>
              <input type="text" name="phone3" placeholder="0000" maxLength="4" value={formData.phone3} onChange={handleChange} />
            </div>
            <div className={styles.exception}>{errors.phone}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.formRow}>
            <span>EMAIL</span>
            <input className={styles.emaildetail}type="email" name="email" value={formData.email} onChange={handleChange} />
            <div className={styles.exception}>{errors.email}</div>
          </div>
          <hr className={styles.signupline} />

          <div className={styles.signupbtn}>
            <button type="submit" className={styles.submitButton}>회원가입</button>
            <Link to="/user">
            <button type="reset" className={styles.submitButton}>취소</button>
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default user_signup;