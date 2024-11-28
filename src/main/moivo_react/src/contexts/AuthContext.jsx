import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { PATH } from "../../scripts/path";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Axios 인터셉터를 한 번만 설정
  const setupAxiosInterceptors = (authToken) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    if (!axios.interceptors.response.handlers.length) {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
  
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
  
            try {
              const refreshToken = sessionStorage.getItem('refreshToken');
              if (!refreshToken) {
                return Promise.reject(error);
              }
  
              const refreshResponse = await axios.post(`${PATH.SERVER}/auth/refresh-token`, { refreshToken });
              const newToken = refreshResponse.data.token;
  
              if (newToken) {
                sessionStorage.setItem('token', newToken);
                setToken(newToken);
  
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
              }
            } catch (refreshError) {
              console.error('토큰 갱신 실패:', refreshError);
            }
          }
  
          return Promise.reject(error);
        }
      );
    }
  };
  

  // 초기화 로직
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = sessionStorage.getItem('token');
      const storedUser = sessionStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          await axios.get(`${PATH.SERVER}/api/user/validate-token`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });

          setToken(storedToken);
          setUser(userData);
          setIsLoggedIn(true);
          setupAxiosInterceptors(storedToken);
        } catch (error) {
          console.error('토큰 검증 실패:', error);
          logout();
        } finally {
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, authToken, refreshToken) => {
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsLoggedIn(true);

    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setupAxiosInterceptors(authToken);
  };

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      token,
      user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
