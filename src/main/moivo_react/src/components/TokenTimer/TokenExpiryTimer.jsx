import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/css/TokenExpiryTimer.module.css';

const TokenExpiryTimer = () => {
    const { tokenExpiryTime, logout } = useAuth();
    const navigate = useNavigate();
    const timerRef = useRef(null);
    const [remainingTime, setRemainingTime] = useState('');
    const [isWarning, setIsWarning] = useState(false);
    const [isDanger, setIsDanger] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState(() => ({
        x: window.innerWidth / 2 - 175,
        y: window.innerHeight - 120
    }));
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // 드래그 시작
    const handleMouseDown = (e) => {
        e.preventDefault();
        const containerRect = e.currentTarget.getBoundingClientRect();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - containerRect.left,
            y: e.clientY - containerRect.top
        });
    };

    // 드래그 중
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // 현재 타이머의 크기를 가져옴
        const timerWidth = timerRef.current?.offsetWidth || 350;
        const timerHeight = timerRef.current?.offsetHeight || 100;

        // 화면 경계 체크
        const maxX = window.innerWidth - timerWidth;
        const maxY = window.innerHeight - timerHeight;

        setPosition({
            x: Math.min(Math.max(0, x), maxX),
            y: Math.min(Math.max(0, y), maxY)
        });
    };

    // 드래그 종료
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // 컨테이너 스타일
    const containerStyle = {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.3s ease'
    };

    useEffect(() => {
        const updateRemainingTime = () => {
            if (!tokenExpiryTime) return;

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
            
            // 남은 시간 표시 형식 개선
            let timeDisplay;
            if (minutes >= 60) {
                const hours = Math.floor(minutes / 60);
                const mins = minutes % 60;
                timeDisplay = `${hours}시간 ${mins}분`;
            } else if (minutes > 0) {
                timeDisplay = `${minutes}분 ${seconds}초`;
            } else {
                timeDisplay = `${seconds}초`;
            }
            
            setIsWarning(minutes < 5);
            setIsDanger(minutes < 1);
            setRemainingTime(timeDisplay);
        };

        updateRemainingTime();
        const timer = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(timer);
    }, [tokenExpiryTime, logout, navigate]);

    const timerClasses = `${styles.tokenTimer} 
        ${isWarning ? styles.warning : ''} 
        ${isDanger ? styles.danger : ''}
        ${isVisible ? '' : styles.minimized}`;

    const handleLoginClick = () => {
        navigate('/user');
    };

    return (
        <div 
            ref={timerRef}
            className={`${styles.tokenTimerContainer} ${isDragging ? styles.dragging : ''}`}
            onMouseDown={handleMouseDown}
            style={containerStyle}
        >
            <div className={timerClasses}>
                <div className={styles.timerContent}>
                    <i className="fas fa-clock"></i>
                    <span className={styles.timerText}>
                        {tokenExpiryTime 
                            ? `세션 만료까지: ${remainingTime}`
                            : '로그인이 필요합니다'
                        }
                    </span>
                </div>
                {isVisible && (
                    <>
                        {isWarning && (
                            <div className={styles.warningMessage}>
                                {isDanger 
                                    ? '곧 세션이 만료됩니다. 다시 로그인해주세요!'
                                    : '세션이 곧 만료됩니다.'
                                }
                            </div>
                        )}
                        <div className={styles.additionalContent}>
                            <p className={styles.infoText}>
                                세션이 만료되면 자동으로 로그아웃됩니다.
                            </p>
                            <button 
                                className={styles.loginButton}
                                onClick={handleLoginClick}
                            >
                                로그인 페이지로 이동
                            </button>
                        </div>
                    </>
                )}
                <button 
                    className={styles.toggleButton}
                    onClick={() => setIsVisible(!isVisible)}
                >
                    {isVisible ? '−' : '+'}
                </button>
            </div>
        </div>
    );
};

export default TokenExpiryTimer;