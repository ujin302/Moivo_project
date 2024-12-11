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

    // 일반 로그인 함수
    const login = async (userId, pwd) => {
        try {
            const response = await axios.post(`${PATH.SERVER}/api/user/login`, {
                userId,
                pwd
            }, {
                withCredentials: true  //쿠키 전송을 위해 작성한거임
            });
            return await handleLoginSuccess(response);
        } catch (error) {
            throw error.response?.data?.error || error.message;
        }
    };

    // 카카오 로그인 함수
    const kakaoLogin = async (loginData) => {
        try {
            console.log("로그인 데이터:", loginData);
            if (!loginData.accessToken) {
                throw new Error('토큰이 없습니다');
            }
            
            // 직접 처리
            setAccessToken(loginData.accessToken);
            localStorage.setItem('userId', loginData.userId);
            localStorage.setItem('id', loginData.id);
            localStorage.setItem('cartId', loginData.cartId);
            localStorage.setItem('wishId', loginData.wishId);
            localStorage.setItem('isAdmin', loginData.isAdmin);
            
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${loginData.accessToken}`;
            return true;
        } catch (error) {
            console.error('카카오 로그인 실패:' + error);
            throw new Error('로그인에 실패했습니다.');
        }
    };

    //일반, 카카오 로그인 성공 시 공통 함수 _ 241210_yjy
    const handleLoginSuccess = async (response) => {
        const { accessToken } = response.data;
        if (!accessToken) {
            throw new Error('로그인에 실패했습니다.');
        }
        
        // localStorage에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('cartId', response.data.cartId);
        localStorage.setItem('wishId', response.data.wishId);
        localStorage.setItem('isAdmin', response.data.isAdmin);

        // 상태 업데이트
        setIsAuthenticated(true);

        // axios 헤더 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return true;
    };

    // axios 인터셉터 설정
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    const accessToken = getAccessToken();
                    if (!accessToken) {
                        removeTokens();
                        setIsAuthenticated(false);
                        navigate('/user');
                        return Promise.reject(error);
                    }

                    // 토큰 재설정
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axios(originalRequest);
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
        login,
        kakaoLogin,
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

// PropTypes 정의 추가
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default AuthProvider;