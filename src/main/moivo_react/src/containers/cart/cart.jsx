import React, { useState } from "react";
import styles from "../../assets/css/Cart.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Angel wing tee", price: 62000, quantity: 1, image: "../image/only1.jpg" },
    { id: 2, name: "Ruffle baggy jeans", price: 129000, quantity: 2, image: "../image/only2.jpg" },
    { id: 2, name: "Basic logo off top", price: 71000, quantity: 1, image: "../image/wish1.jpg" },
    { id: 2, name: "Isabella fur coat", price: 283000, quantity: 3, image: "../image/wish2.png" },
  ]);

  const handleQuantityChange = (id, action) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: action === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
        <Banner/>
        <div className={styles.cartFrame}>
        <div className={styles.title}>CART</div>
        {cartItems.length > 0 ? (
            <div className={styles.cartContainer}>
            {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                <div className={styles.productImage}>
                    <img src={item.image} alt={item.name} />
                </div>
                <div className={styles.productDetails}>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productPrice}>KRW {item.price.toLocaleString()}</div>
                    <div className={styles.quantityControls}>
                    <button onClick={() => handleQuantityChange(item.id, "decrease")}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, "increase")}>+</button>
                    </div>
                    <button className={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>
                    REMOVE
                    </button>
                </div>
                </div>
            ))}
            <div className={styles.totalSection}>
                <div className={styles.totalText}>Total: KRW {totalPrice.toLocaleString()}</div>
                <button className={styles.checkoutButton}>BUY NOW</button>
            </div>
            </div>
        ) : (
            <div className={styles.emptyCart}>Your cart is empty.</div>
        )}
        </div>
        <Footer/>
    </div>
  );
};

export default cart;
