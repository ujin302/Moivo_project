import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../../../assets/css/modal.module.css';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ListModal = ({ isOpen, onClose, title, items, onRemove, onQuantityChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = false; // 로그인 상태를 나타내는 변수 (실제로는 로그인 상태에 따라 동적으로 설정되어야 함)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleItemSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => onRemove(id));
    setSelectedItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const handleCheckout = () => {
    // 결제 페이지로 이동하는 로직
    //navigate('/checkout');
  };

  const handleAddSelectedToMyWishlist = async () => {
    if (!isLoggedIn) {
      navigate('/user'); // 로그인 페이지로 이동
      return;
    }

    const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
    
    try {
      // 선택된 아이템들을 나의 위시리스트 API로 전송
      await axios.post('/api/user/mypage/wishlist', selectedItemsData);
      alert('선택한 상품들이 나의 위시리스트에 추가되었습니다.');
      setSelectedItems([]);
    } catch (error) {
      console.error('위시리스트 추가 실패:', error);
      alert('위시리스트 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <motion.div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className={styles.modalContent}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalControls}>
            {items.length > 0 && (
              <button 
                className={styles.deleteSelectedButton}
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
              >
                선택 삭제 ({selectedItems.length})
              </button>
            )}
          </div>

          <div className={styles.itemsGrid}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                    className={styles.checkbox}
                  />
                </div>
                <div className={styles.itemImageWrap}>
                  <img src={item.productimg[0].fileurl} alt={item.name} className={styles.itemImage} />
                </div>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>₩{item.price.toLocaleString()}</p>
                  {title === "장바구니" && (
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => onQuantityChange(item.id, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                      >-</button>
                      <span>{item.quantity || 1}</span>
                      <button 
                        onClick={() => onQuantityChange(item.id, (item.quantity || 1) + 1)}
                      >+</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {items.length > 0 ? (
          <div className={styles.modalFooter}>
            <div className={styles.totalPrice}>
              <span>총 금액</span>
              <strong>₩{getTotalPrice().toLocaleString()}</strong>
            </div>
            {title === "장바구니" && (
              <button 
                className={styles.checkoutBtn}
                onClick={handleCheckout}
              >
                결제하기 <FaShoppingCart />
              </button>
            )}
            {title === "위시리스트" && (
              <button 
                className={styles.addToMyWishlistButton}
                onClick={handleAddSelectedToMyWishlist}
              >
                나의 위시리스트로 보내기 <FaHeart />
              </button>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            {title === "장바구니" ? <FaShoppingCart /> : <FaHeart />}
            <p>{title === "장바구니" ? "장바구니가 비어있습니다." : "위시리스트가 비어있습니다."}</p>
            <button className={styles.shopBtn} onClick={onClose}>쇼핑 계속하기</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ListModal;