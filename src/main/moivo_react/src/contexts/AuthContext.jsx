import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // axios 인터셉터 설정 함수
  const setupAxiosInterceptors = (storedToken, userData) => {
    // 기본 헤더 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

    // 응답 인터셉터
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          const originalRequest = error.config;
          
          // 재시도 방지
          if (originalRequest._retry) {
            logout();
            return Promise.reject(error);
          }
          
          originalRequest._retry = true;

          try {
            // 토큰 갱신 요청
            const refreshResponse = await axios.post('/api/user/refresh-token', {
              userId: userData.userId,
              pwd: userData.pwd
            }, {
              headers: { 'Authorization': null } // 기존 토큰 제거
            });

            const newToken = refreshResponse.data.jwt;
            if (newToken) {
              sessionStorage.setItem('token', newToken);
              setToken(newToken);
              axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
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
            await axios.get('/api/user/validate-token', {
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
    setupAxiosInterceptors(authToken, userData);
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