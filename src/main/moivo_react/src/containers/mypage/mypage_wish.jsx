import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/Mypage_wish.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const MypageWish = () => {
  const [wishlistItems, setWishlistItems] = useState([]); // 상태로 찜 목록 관리
  const userId = 1; // 임시 userId

  // 찜 목록 가져오기
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`/api/user/wish`, {
          params: { userid: userId },
        });
        setWishlistItems(response.data); 
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  // 찜 목록에서 삭제
  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/api/user/wish/${productId}`, {
        params: { userid: userId },
      });
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  return (
    <div className={styles.wishlistPage}>
      <Banner />
      <div className={styles.title}>WISHLIST</div>
      <div className={styles.container}>
        <div className={styles.wishlistContainer}>
          {wishlistItems.map((item) => (
            <div key={item.id} className={styles.wishlistItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemPrice}>{item.price}</div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.bottomBar}></div>
        <Link to="/mypage" className={styles.backLink}>
          Go Back to MyPage
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default MypageWish;
