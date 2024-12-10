import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    
    if (code) {
      // 백엔드로 인가코드 전송
      fetch('/api/oauth/kakao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          login(data.token);
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
        navigate('/login');
      });
    }
  }, []);

  return (
    <div>로그인 처리중...</div>
  );
};

export default OAuth2RedirectHandler;