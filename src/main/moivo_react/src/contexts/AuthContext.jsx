import axiosInstance from '../utils/axiosConfig';
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from "../../scripts/path";
import PropTypes from 'prop-types';

// AuthContext 생성 및 내보내기
export const AuthContext = createContext(null);

// useAuth 훅 생성 및 내보내기
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // 2024-12-11 isAdmin 상태 추가 장훈
    const navigate = useNavigate();

    // 토큰 관리 함수들
    const setAccessToken = (token) => {
        localStorage.setItem('accessToken', token);
    };

    const setRefreshToken = (token) => {
        localStorage.setItem('refreshToken', token);
    };

    const getAccessToken = () => {
        return localStorage.getItem('accessToken');
    };

    const getRefreshToken = () => {
        return localStorage.getItem('refreshToken');
    };

    const removeTokens = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // 토큰 갱신 함수
    const refreshAccessToken = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/refresh', {}, {
                withCredentials: true // 쿠키 전송을 위해 필요
            });
            
            if (response.data?.accessToken) {
                setAccessToken(response.data.accessToken);
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('토큰 갱신 실패:', error);
            removeTokens();
            setIsAuthenticated(false);
            return false;
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();
            
            // 토큰이 있는 경우에만 로그아웃 요청
            if (accessToken) {
                await axiosInstance.post(`/api/user/logout`, 
                    { refreshToken },
                    {
                        withCredentials: true,
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    }
                );
            }
            removeTokens();
            setIsAuthenticated(false);
            setIsAdmin(false); // 2024-12-11 로그아웃 시 isAdmin 상태 초기화 장훈
            
            // 사용자 정보 제거
            localStorage.removeItem('userId');
            localStorage.removeItem('id');
            localStorage.removeItem('cartId');
            localStorage.removeItem('wishId');

            // 로컬 스토리지 토큰 제거
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            navigate('/');
        } catch (error) {
            console.error('로그아웃 요청 실패:', error);

            // 에러가 발생하더라도 로컬의 토큰은 제거
            localStorage.removeItem("accessToken");
            setIsAuthenticated(false);
            setIsAdmin(false); // 2024-12-11 로그아웃 시 isAdmin 상태 초기화 장훈
            navigate('/');
        }
    };

    // 일반 로그인 함수
    const login = async (userId, pwd) => {
        try {
            const response = await axiosInstance.post(`/api/user/login`, {
                userId,
                pwd
            }, {
                withCredentials: true  // 쿠키 전송을 위해 작성한거임
            });
            return await handleLoginSuccess(response);
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    };

    // 카카오 로그인 함수
    const kakaoLogin = async (code) => {
        try {
            const response = await axiosInstance.get(`/api/oauth/kakao/callback`, {
                params: { code },
                withCredentials: true
            });
            
            const success = await handleLoginSuccess(response.data);
            if (success) {
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('카카오 로그인 실패:', error);
            throw error.response?.data?.error || error.message;
        }
    };

    // 일반, 카카오 로그인 성공 시 공통 함수
    const handleLoginSuccess = async (response) => {
        const { accessToken, isAdmin } = response.data; //2024-12-11 idAdmin 추가 장훈
        if (!accessToken) {
            throw new Error('로그인에 실패했습니다.');
        }
        
        // localStorage에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('cartId', response.data.cartId);
        localStorage.setItem('wishId', response.data.wishId);
        localStorage.setItem('isAdmin', isAdmin); // 2024-12-11 isAdmin 값을 localStorage에 저장 장훈

        // 상태 업데이트
        setIsAuthenticated(true);
        setIsAdmin(isAdmin); // 2024-12-11 isAdmin 상태 업데이트 장훈

        // axios 헤더 설정
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return true;
    };

    // axios 인터셉터 설정
    useEffect(() => {
        // 요청 인터셉터 추가
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 응답 인터셉터
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // access token 만료 에러 && 재시도하지 않은 요청
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        // refresh token으로 새로운 access token 발급
                        const refreshToken = localStorage.getItem('refreshToken');
                        const response = await axiosInstance.post('/api/auth/refresh', { refreshToken });
                        
                        const { accessToken } = response.data;
                        localStorage.setItem('accessToken', accessToken);

                        // 새로운 토큰으로 원래 요청 재시도
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axiosInstance(originalRequest);
                    } catch (refreshError) {
                        // refresh token도 만료된 경우
                        localStorage.removeItem('accessToken');
                        setIsAuthenticated(false);
                        window.location.href = '/user';
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // 초기 인증 상태 확인 (새로고침해도 로그인 상�� 유지)
    useEffect(() => {
        const token = getAccessToken();
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true'; // 2024-12-11 isAdmin 값을 가져옴 장훈
        if (token) {
            setIsAuthenticated(true);
            setIsAdmin(storedIsAdmin); // 2024-12-11 isAdmin 상태 설정 장훈
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

    const value = {
        isAuthenticated,
        isAdmin, // 2024-12-11 isAdmin 값을 Context에서 제공 장훈
        setIsAuthenticated,
        setIsAdmin, // 2024-12-11 isAdmin 값을 변경할 수 있는 함수 제공 장훈
        login,
        logout,
        kakaoLogin,
        handleLoginSuccess,
        getAccessToken,
        getRefreshToken,
        refreshAccessToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// PropTypes 정의 추가
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;
