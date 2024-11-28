import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import signin from '../../assets/css/user_login.module.css';
import axios from 'axios';

const user_login = () => {

  const navigate = useNavigate();
  const { login: loginContext } = useContext(AuthContext);
  const [formData, setFormData] = useState({ userId: '', pwd: '' });
  const [error, setError] = useState('');

    //사용자 데이터 요청하는 함수임
    const fetchUserData = async () => {
        const token = sessionStorage.getItem("token"); // JWT를 가져옴
        try {
            const response = await axios.get("http://localhost:8080/api/user/info", {    //  /api/user -> LoginController로 이동
                headers: {
                    Authorization: `Bearer ${token}`, // 헤더에 JWT 추가
                },
            });
            console.log("사용자 정보:", response.data);
        } catch (error) {
            console.error("데이터 요청 실패:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post("http://localhost:8080/api/user/login", formData);

            const {jwt, id, wishId, cartid} = response.data;

            sessionStorage.setItem("token", jwt);
            sessionStorage.setItem("id", id);
            sessionStorage.setItem("wishId", wishId);
            sessionStorage.setItem("cartid", cartid);
            
            loginContext();  // Changed login to loginContext
            alert("로그인 성공!");
            navigate("/");
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인에 실패했습니다.");
        }
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={signin.loginMain}>
      <div className={signin.container} id="container">
        <div className={`${signin['form-container']} ${signin['sign-in-container']}`}>
          <form onSubmit={handleSubmit}>
            <Link to="/">
              <h1>Moivo</h1>
            </Link>
            <div className={signin['social-container']}>
              <a href="#" className={signin.social}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className={signin.social}><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className={signin.social}><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>If you don't want to sign up,<br/>or use your account instead.</span>
            {error && <div className={signin.error}>{error}</div>}
            <input type="text" name="userId" value={formData.id} onChange={handleChange} placeholder="ID" required/>
            <input type="password" name="pwd" value={formData.pwd} onChange={handleChange} placeholder="Password" required/>
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
            <Link to="/user_signup">
                <button type="submit" className={signin.singupbtn}>Sign Up</button>
            </Link>
          </form>
        </div>

        <div className={signin['overlay-container']}>
          <div className={signin.overlay}>
            <div className={`${signin['overlay-panel']} ${signin['overlay-right']}`}>
              <h2>Hello, Style Icon!</h2>
              <p>Enter your personal details and start journey with us</p>
              <Link to="/user_signup">
                <button className={signin.ghost} id="signUp">Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default user_login;
