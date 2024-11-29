import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { PATH } from "../../scripts/path";
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // axios 인터셉터 설정 함수
  const setupAxiosInterceptors = (authToken) => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // 토큰 만료로 인한 401 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // 토큰 갱신 요청 시 현재 토큰 정보도 함께 전송
            const refreshResponse = await axios.post(`${PATH.SERVER}/api/user/refresh-token`, {}, {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            });

            if (refreshResponse.data && refreshResponse.data.jwt) {
              const newToken = refreshResponse.data.jwt;
              setToken(newToken);
              sessionStorage.setItem('token', newToken);
              
              // 모든 후속 요청에 새 토큰 적용
              axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              
              // 원래 요청 재시도
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              
              // 토큰 갱신 성공 시 원래 요청 재시도
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
            // 토큰 갱신 실패 시에만 로그아웃
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return interceptor;
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const validateAndSetup = async () => {
          try {
            // 토큰 검증 먼저 수행
            await axios.get(`${PATH.SERVER}/api/user/validate-token`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            
            // 토큰이 유효한 경우에만 상태 설정
            setToken(storedToken);
            setUser(userData);
            setIsLoggedIn(true);
            setupAxiosInterceptors(storedToken, userData);
          } catch (error) {
            console.error('토큰 검증 실패:', error);
            logout();
          }
        };
        
        validateAndSetup();
      } catch (error) {
        console.error('세션 복구 실패:', error);
        logout();
      }
    }
  }, []);

  const login = (userData, authToken) => {
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsLoggedIn(true);
    
    // axios 기본 설정에 토큰 추가
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('paymentId');
    sessionStorage.removeItem('wishId');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    
    // axios 기본 설정에서 토큰 제거
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      token, 
      user,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};