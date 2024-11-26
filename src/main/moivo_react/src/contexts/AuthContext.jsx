import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  const login = async () => {
    try {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setIsLoggedIn(true);
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
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      token,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};