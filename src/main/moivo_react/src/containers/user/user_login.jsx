import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { PATH } from "../../../scripts/path";
import signin from '../../assets/css/user_login.module.css';
import apiClient from '../../utils/apiClient';
import kakaoLoginImage from '../../assets/image/kakao_login.png';

const user_login = () => {

  const navigate = useNavigate();
  const {login} = useContext(AuthContext);
  const [formData, setFormData] = useState({ userId: '', pwd: '' });
  const [error, setError] = useState('');

    //사용자 데이터 요청하는 함수임
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await apiClient.get('/api/user/info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("사용자 정보:", response.data);
        } catch (error) {
            console.error("데이터 요청 실패:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const success = await login(formData.userId, formData.pwd);
            if (success) {
                await fetchUserData();
                navigate('/');
            }
        } catch (error) {
            setError(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleKakaoLogin = async () => {
        try {
            const response = await axios.get(`${PATH.SERVER}/api/user/social/kakao`);
            console.log(response.data);
            window.location.href = response.data;
        } catch (error) {
            console.error("인증 오류:", error);
        }
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
                            <button 
                                type="button"
                                onClick={handleKakaoLogin}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer'
                                }}
                            >
                                <img 
                                    src={kakaoLoginImage} 
                                    alt="카카오 로그인" 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        cursor: 'pointer'
                                    }} 
                                />
                            </button>
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