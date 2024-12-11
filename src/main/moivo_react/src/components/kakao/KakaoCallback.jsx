import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { PATH } from '../../../scripts/path';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { kakaoLogin } = useAuth();
  
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    
    if (code) {
      axios.get(`${PATH.SERVER}/api/oauth/kakao/callback?code=${code}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        console.log("첫 번째 응답:", response.data);
        const { accessToken, refreshToken, userId } = response.data;
        
        return axios.post(`${PATH.SERVER}/api/user/kakao-login`, 
          { userId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
      })
      .then(loginResponse => {
        console.log("두 번째 응답:", loginResponse.data);
        if (!loginResponse.data || !loginResponse.data.accessToken) {
          throw new Error('유효하지 않은 응답 데이터');
        }
        kakaoLogin(loginResponse.data);
        navigate('/');
      })
      .catch(error => {
        console.error('카카오 로그인 실패:', error);
        console.error('에러 응답:', error.response?.data);
        navigate('/user');
      });
    }
  }, [navigate, kakaoLogin]);

  return <div>로그인 처리중...</div>;
};

export default KakaoCallback;  //_ 241210_yjy