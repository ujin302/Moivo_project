import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 토큰 만료 시간 계산
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = new Date(decodedToken.exp * 1000);
      setTokenExpiration(expirationTime);
    } else {
      setIsLoggedIn(false);
      setUser(null);

    }
  }, []);

  const login = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsLoggedIn(true);

        // 토큰 만료 시간 계산
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = new Date(decodedToken.exp * 1000);
        setTokenExpiration(expirationTime);
      }
    } catch (error) {
      console.error('로그인 상태 업데이트 실패:', error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      tokenExpiration,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};