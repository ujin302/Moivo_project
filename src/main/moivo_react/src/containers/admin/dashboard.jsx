import React, { useState, useEffect } from 'react';
import admin_dashboard from '../../assets/css/admin_dashboard.module.css';

const dashboard = () => {  // 컴포넌트 이름을 'Dashboard'로 변경
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
    });
    const [notifications, setNotifications] = useState([
        '새로운 주문이 접수되었습니다.',
        '고객 피드백을 확인해주세요.',
        '재고가 부족한 제품이 있습니다.',
    ]);
    const [recentActivities, setRecentActivities] = useState([
        '2024-12-01: 제품 A가 재입고되었습니다.',
        '2024-12-02: 주문 #12345이/가 완료되었습니다.',
    ]);

    useEffect(() => {
        // 데이터 가져오는 로직을 여기에 추가
        // 예: fetch("/api/dashboard/stats")
        setStats({
            totalSales: 150000,
            totalOrders: 150,
            totalProducts: 75,
            totalCustomers: 200,
        });
    }, []);

    return (
        <div className={admin_dashboard.dashboardMain}>
            <div className={admin_dashboard.dashboardContainer}>
                <h2 className={admin_dashboard.dashboardTitle}>관리자 대시보드</h2>
                
                {/* 개요 및 통계 */}
                <div className={admin_dashboard.statsContainer}>
                    <div className={admin_dashboard.statCard}>
                        <h3 className={admin_dashboard.statTitle}>총 매출</h3>
                        <p className={admin_dashboard.statValue}>${stats.totalSales.toLocaleString()}</p>
                    </div>
                    <div className={admin_dashboard.statCard}>
                        <h3 className={admin_dashboard.statTitle}>총 주문</h3>
                        <p className={admin_dashboard.statValue}>{stats.totalOrders}</p>
                    </div>
                    <div className={admin_dashboard.statCard}>
                        <h3 className={admin_dashboard.statTitle}>총 제품</h3>
                        <p className={admin_dashboard.statValue}>{stats.totalProducts}</p>
                    </div>
                    <div className={admin_dashboard.statCard}>
                        <h3 className={admin_dashboard.statTitle}>총 고객</h3>
                        <p className={admin_dashboard.statValue}>{stats.totalCustomers}</p>
                    </div>
                </div>

                {/* 주요 활동 알림 */}
                <div className={admin_dashboard.notificationsContainer}>
                    <h3 className={admin_dashboard.notificationsTitle}>주요 활동 알림</h3>
                    <ul className={admin_dashboard.notificationsList}>
                        {notifications.map((notification, index) => (
                            <li key={index} className={admin_dashboard.notificationItem}>
                                {notification}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 최근 활동 피드 */}
                <div className={admin_dashboard.recentActivitiesContainer}>
                    <h3 className={admin_dashboard.recentActivitiesTitle}>최근 활동</h3>
                    <ul className={admin_dashboard.recentActivitiesList}>
                        {recentActivities.map((activity, index) => (
                            <li key={index} className={admin_dashboard.recentActivityItem}>
                                {activity}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default dashboard;
