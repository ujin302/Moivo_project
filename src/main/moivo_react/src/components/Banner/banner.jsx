import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from '../../assets/css/banner.module.css';
import axios from 'axios';

const Banner = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, tokenExpiration } = useContext(AuthContext);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const navLinks = [
    {
      title: 'SHOP',
      submenu: [
        { name: 'ALL', navigateTo: '/product-list' },
        { name: 'NEW', navigateTo: '/product-list' },
        { name: 'BEST', navigateTo: '/product-list' },
        { name: 'Dashboard', navigateTo: '/product-board' }
      ]
    },
    {
      title: 'COMMUNITY',
      submenu: [
        { name: '파일업로드(임시)', navigateTo: '/upload' },
        { name: 'Q&A', navigateTo: '/qna_faqboard' },
        { name: '게시판', navigateTo: '/qna_board' },
        { name: 'REVIEW', navigateTo: '/qna/review' }
      ]
    }
  ];

  const handleToggleMenu = (idx) => {
    setOpenMenuIndex(openMenuIndex === idx ? null : idx);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    logout();
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  const formatExpiration = (expiration) => {
    if (!expiration) return '';
    return expiration.toLocaleString();
  };

  return (
    <header className={styles.banner}>
      <div className={styles.inner}>
        <h1 className={styles.logo}>
          <a className={styles.logoLink} onClick={() => navigate('/')}>
            Moivo
          </a>
        </h1>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link, idx) => (
              <li key={idx} className={styles.navItem}>
                <button className={styles.navLink} onClick={() => handleToggleMenu(idx)}>
                  {link.title}
                </button>
                {openMenuIndex === idx && (
                  <div className={styles.subMenu}>
                    {link.submenu.map((item, subIdx) => (
                      <a
                        key={subIdx}
                        className={styles.subLink}
                        onClick={() => navigate(item.navigateTo)}>
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.utility}>
          {isLoggedIn ? (
            <>
              <a href="/mypage" className={styles.utilityLink}>My Page</a>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <>
              <a href="/user" className={styles.utilityLink}>Login</a>
              <a href="/user_signup" className={styles.utilityLink}>Sign Up</a>
            </>
          )}

          <a href='/product-search' className={styles.utilityLink}>Search</a>

          <div className={styles.loginStatus}>
            <span>
              <span className={`${styles.status} ${isLoggedIn ? styles.on : styles.off}`}></span>
              {isLoggedIn ? 'ON' : 'OFF'}
            </span>
            {isLoggedIn && (
              <>
                <span className={styles.expirationLabel}>로그인 만료</span>
                <span className={styles.expiration}>{formatExpiration(tokenExpiration)}</span>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Banner;
