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
  ];

  const [currentText, setCurrentText] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      const textInterval = setInterval(() => {
        setCurrentText((prev) => (prev + 1) % loadingTexts.length);
      }, 1500);

      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 50);

      return () => {
        clearInterval(textInterval);
        clearInterval(progressInterval);
      };
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
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.loadingContainer}>
              <div className={styles.logoContainer}>
                <div className={styles.fashionIcon}>
                  <span className={styles.hanger}></span>
                  <span className={styles.dress}></span>
                </div>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" }
                }}
                exit={{ opacity: 0, y: -20 }}
              >
                {loadingTexts[currentText]}
              </motion.div>

              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${progress}%` }}
                />
                <div className={styles.progressText}>{progress}%</div>
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