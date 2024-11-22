// src/components/Sidebar/Sidebar.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "../../assets/css/product_board.module.css";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // 사이드바 상태를 컴포넌트 내부에서 관리
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* 사이드바 토글 버튼 */}
      <div className={styles.navRight}>
        <button onClick={toggleSidebar} className={styles.button}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </button>
      </div>

      {/* 사이드바 */}
      <div ref={sidebarRef} className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <button onClick={closeSidebar} className={styles.closeButton}> X </button>
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarItem}><Link to="/" className={styles.sidebarAnchor}>Home</Link></li>
          <li className={styles.sidebarItem}><Link to="/product-list" className={styles.sidebarAnchor}>상품리스트</Link></li>
          <li className={styles.sidebarItem}><Link to="#" className={styles.sidebarAnchor}>Item 3</Link></li>
          <li className={styles.sidebarItem}><Link to="#" className={styles.sidebarAnchor}>Item 4</Link></li>
          <li className={styles.sidebarItem}><Link to="#" className={styles.sidebarAnchor}>Item 5</Link></li>
          <li className={styles.sidebarItem}><Link to="#" className={styles.sidebarAnchor}>Item 6</Link></li>
          <li className={styles.sidebarItem}><Link to="#" className={styles.sidebarAnchor}>Item 7</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
