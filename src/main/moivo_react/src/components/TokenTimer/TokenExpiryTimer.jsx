import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/TokenExpiryTimer.module.css';

const TokenExpiryTimer = () => {
    const { tokenExpiryTime, logout } = useAuth();
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState('');
    // 경고 상태를 관리하는 상태 추가
    const [isWarning, setIsWarning] = useState(false);
    // 위험 상태를 관리하는 상태 추가
    const [isDanger, setIsDanger] = useState(false);

    useEffect(() => {
        const updateRemainingTime = () => {
            if (!tokenExpiryTime) {
                console.log('No token expiry time available');
                return;
            }

            const now = Date.now();
            const timeLeft = tokenExpiryTime - now;

            if (timeLeft <= 0) {
                setRemainingTime('만료됨');
                logout();
                navigate('/user');
                return;
            }

            // 분과 초 계산
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // 경고 상태 업데이트 (5분 이하)
            setIsWarning(minutes < 5);
            // 위험 상태 업데이트 (1분 이하)
            setIsDanger(minutes < 1);
            
            setRemainingTime(formattedTime);
        };

        updateRemainingTime();
        const timer = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(timer);
    }, [tokenExpiryTime, logout, navigate]);

    // 타이머 클래스 동적 생성
    const timerClasses = `${styles.tokenTimer} 
        ${isWarning ? styles.warning : ''} 
        ${isDanger ? styles.danger : ''}`;

    return (
        <div className={styles.tokenTimerContainer}>
            <div className={timerClasses}>
                <i className="fas fa-clock"></i>
                <span className={styles.timerText}>
                    {tokenExpiryTime 
                        ? `관리자 로그인 만료까지: ${remainingTime}`
                        : '로그인 정보 없음'
                    }
                </span>
            </div>
        </div>
    );
};

export default TokenExpiryTimer;