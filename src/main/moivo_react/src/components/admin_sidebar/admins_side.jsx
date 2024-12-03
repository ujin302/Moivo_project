import React from 'react';
import { Link } from 'react-router-dom';
import admin_sidebar from '../../assets/css/admin_side.module.css';

const admins_side = () => {
    return (
        <div className={admin_sidebar.sidebar}>
            <ul className={admin_sidebar.menuList}>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_dashboard" className={admin_sidebar.menuText}>대시보드</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_products" className={admin_sidebar.menuText}>제품 관리</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_orders" className={admin_sidebar.menuText}>주문 및 고객 관리</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_users" className={admin_sidebar.menuText}>사용자 권한 관리</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_notices" className={admin_sidebar.menuText}>공지사항 및 콘텐츠 관리</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_reviews" className={admin_sidebar.menuText}>리뷰 및 피드백 관리</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_reports" className={admin_sidebar.menuText}>통계 및 리포트</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_payments" className={admin_sidebar.menuText}>결제 및 금융 관리</Link>
                </li>
                <li className={admin_sidebar.menuItem}>
                    <Link to="/admin/admin_notifications" className={admin_sidebar.menuText}>알림</Link>
                </li>
            </ul>
        </div>
    );
};

export default admins_side;