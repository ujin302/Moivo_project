import React from "react";
import { Link } from "react-router-dom";
import styles from "../../assets/css/Mypage_wish.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const mypage_wish = () => {
  const wishlistItems = [
    { image: "../image/wish1.jpg", name: "Basic logo off top", price: "KRW 71,000" },
    { image: "../image/wish2.png", name: "Isabella fur coat", price: "KRW 283,000" },
    { image: "../image/wish3.jpg", name: "Shawl Collar Down Vest_Black", price: "KRW 345,000" },
    { image: "../image/wish4.jpg", name: "Mohair Round Neck Cardigan_Red", price: "KRW 138,000" },
    { image: "../image/wish1.jpg", name: "Basic logo off top", price: "KRW 71,000" },
    { image: "../image/wish2.png", name: "Isabella fur coat", price: "KRW 283,000" },
    { image: "../image/wish3.jpg", name: "Shawl Collar Down Vest_Black", price: "KRW 345,000" },
    { image: "../image/wish4.jpg", name: "Mohair Round Neck Cardigan_Red", price: "KRW 138,000" },
    { image: "../image/wish1.jpg", name: "Basic logo off top", price: "KRW 71,000" },
    { image: "../image/wish2.png", name: "Isabella fur coat", price: "KRW 283,000" },
    { image: "../image/wish3.jpg", name: "Shawl Collar Down Vest_Black", price: "KRW 345,000" },
    { image: "../image/wish4.jpg", name: "Mohair Round Neck Cardigan_Red", price: "KRW 138,000" },
  ]; 

  return (
    <div className={styles.wishlistPage}>
      <Banner />
      <div className={styles.title}>WISHLIST</div>
        <div className={styles.container}>
        <div className={styles.wishlistContainer}>
          {wishlistItems.map((item, index) => (
            <div key={index} className={styles.wishlistItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemPrice}>{item.price}</div>
                <button className={styles.removeButton}>Remove</button>
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

export default mypage_wish;