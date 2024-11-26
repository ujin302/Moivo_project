import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 세션스토리지 확인
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      // axios 기본 헤더 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = (userData, authToken) => {
    console.log('로그인 시도:', { userData, authToken });
    sessionStorage.setItem('token', authToken);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    setIsLoggedIn(true);
    // axios 기본 헤더 설정
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    console.log('로그인 완료:', { token: authToken, user: userData });
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    // axios 헤더 제거
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