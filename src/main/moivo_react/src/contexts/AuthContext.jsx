import axios from 'axios';
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
            const refreshToken = getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token');
    
            const response = await axios.post(`${PATH.SERVER}/api/auth/token/refresh`, 
                refreshToken ,
                { withCredentials: true }
            );
            
            if (response.data?.accessToken) {
                setAccessToken(response.data.accessToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                return true;
            }
            return false;
        } catch (error) {
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
        await axios.post(`${PATH.SERVER}/api/user/logout`, 
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
    setIsAuthenticated(false);
    
    // 사용자 정보 제거
    localStorage.removeItem('userId');
    localStorage.removeItem('id');
    localStorage.removeItem('isAdmin');
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
      navigate('/');
    }
  };

    // 로그인 함수 추가
    const login = async (userId, pwd) => {
        try {
            const response = await axios.post(`${PATH.SERVER}/api/user/login`, {
                userId,
                pwd
            }, {
                withCredentials: true  // 쿠키 전송을 위해 작성함
            });

            if (response.data.accessToken) {
                const { accessToken, refreshToken } = response.data;
                setAccessToken(accessToken);
                setRefreshToken(refreshToken);
                setIsAuthenticated(true);

                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('isAdmin', response.data.isAdmin);
                localStorage.setItem('cartId', response.data.cartId);
                localStorage.setItem('wishId', response.data.wishId); /////////

                // axios 기본 헤더 설정
                axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('로그인 실패:', error);
            throw error;
        }
    };
    
    // axios 인터셉터 설정
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    try {
                    const refreshed = await refreshAccessToken();
                    if (refreshed) {
                        originalRequest.headers['Authorization'] = `Bearer ${getAccessToken()}`;
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    removeTokens();
                    setIsAuthenticated(false);
                    navigate('/login');
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // 초기 인증 상태 확인 (새로고침해도 로그인 상태 유지)
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        login,  // login 함수 추가
        logout,
        setAccessToken,
        setRefreshToken,
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