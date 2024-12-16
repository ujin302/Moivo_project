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
        console.log(code);
        
        if (code) {
            axios.get(`${PATH.SERVER}/api/user/social/kakao/login?code=${code}`)
            .then(response => {
                console.log(response.data);
                kakaoLogin(response.data);
                navigate('/');
            }).catch(error => {
                console.error(error);
                navigate('/user');
            })
        }
    }, []);
  
    return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
