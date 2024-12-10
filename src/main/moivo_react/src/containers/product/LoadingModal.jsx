import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import styles from '../../assets/css/LoadingModal.module.css';

const LoadingModal = ({ isOpen }) => {
  const loadingTexts = [
    '상품 정보를 불러오는 중입니다',
    '재고 현황을 확인하고 있습니다',
    '사이즈 정보를 체크하고 있습니다',
    '상품 리뷰를 가져오고 있습니다',
    '트렌드 분석을 진행하고 있습니다',
    '스타일 추천을 준비하고 있습니다'
  ];

  const [currentText, setCurrentText] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      const textInterval = setInterval(() => {
        setCurrentText((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          const increment = Math.random() * 3 + 1;
          return Math.min(prev + increment, 100);
        });
      }, 100);

      return () => {
        clearInterval(textInterval);
        clearInterval(progressInterval);
      };
    } else {
      setProgress(0);
      setCurrentText(0);
    }
  }, [isOpen, loadingTexts.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className={styles.loadingContainer}>
              <div className={styles.logoContainer}>
                <div className={styles.fashionIcon}></div>
              </div>

              <div className={styles.spinnerContainer}>
                <div className={styles.spinnerOuter}>
                  <div className={styles.spinnerMiddle}>
                    <div className={styles.spinnerInner}></div>
                  </div>
                </div>
              </div>

              <motion.div 
                className={styles.loadingText}
                key={currentText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                exit={{ opacity: 0, y: -10 }}
              >
                {loadingTexts[currentText]}
              </motion.div>

              <div className={styles.progressBarContainer}>
                <motion.div 
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
                />
                <motion.div 
                  className={styles.progressText}
                  key={Math.floor(progress)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {Math.floor(progress)}%
                </motion.div>
              </div>

              <div className={styles.loadingDots}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

LoadingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default LoadingModal;