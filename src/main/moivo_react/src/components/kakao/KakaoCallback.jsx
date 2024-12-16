import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { PATH } from '../../../scripts/path';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const { handleLoginSuccess } = useAuth();

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(`${PATH.SERVER}/api/user/info`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("사용자 정보:", response.data);
            return true;
        } catch (error) {
            console.error("데이터 요청 실패:", error);
            return false;
        }
    };
/*
    useEffect(() => {
        const processKakaoLogin = async () => {
            try {
                const code = new URLSearchParams(window.location.search).get("code");
                console.log("인증 코드:", code);
    
                const response = await axios.get(`${PATH.SERVER}/api/oauth/kakao/callback`, {
                    params: { code },
                    withCredentials: true,
                });
                console.log("서버 응답:", response.data);
    
                // 로그인 성공 처리
                const success = await handleLoginSuccess(response.data);
    
                if (success) {
                    console.log("메인 페이지로 이동");
                    navigate("/", { replace: true }); // replace: true로 브라우저 히스토리 교체
                } else {
                    console.error("로그인 처리 실패");
                    alert("로그인 처리 중 오류가 발생했습니다.");
                    navigate("/user", { replace: true });
                }
            } catch (error) {
                console.error("로그인 오류:", error.response?.data || error.message);
                alert("로그인 처리 중 오류가 발생했습니다.");
                navigate("/user", { replace: true });
            }
        };   
    
        processKakaoLogin();
    }, [navigate]);
    */

    return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
