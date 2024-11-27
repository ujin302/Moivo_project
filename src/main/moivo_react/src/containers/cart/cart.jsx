import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/Cart.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Angel wing tee", price: 62000, quantity: 1, image: "../image/only1.jpg" },
    { id: 2, name: "Ruffle baggy jeans", price: 129000, quantity: 2, image: "../image/only2.jpg" },
    { id: 3, name: "Basic logo off top", price: 71000, quantity: 1, image: "../image/wish1.jpg" },
    { id: 4, name: "Isabella fur coat", price: 283000, quantity: 3, image: "../image/wish2.png" },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

  // 항목 선택 토글
  const toggleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  // 수량 변경
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

  // 장바구니에서 삭제
  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setSelectedItems((prevSelected) => prevSelected.filter((itemId) => itemId !== id));
  };

  // 선택된 항목만 결제 페이지로 이동
  const handleBuyNow = () => {
    console.log("Selected items before buy now:", selectedItems); // 디버그용
    if (selectedItems.length === 0) {
      alert("선택한 항목이 없습니다. 항목을 선택해주세요.");
      return; // 선택한 항목이 없으면 함수 종료
    }
  
    const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
    console.log("Selected items to buy:", selectedCartItems); // 디버그용
    navigate("/payment", { state: { items: selectedCartItems } });
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <Banner />
      <div className={styles.cartFrame}>
        <div className={styles.title}>CART</div>
        {cartItems.length > 0 ? (
          <div className={styles.cartContainer}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <input
                  type="checkbox"
                  id={`checkbox-${item.id}`} // 고유 id 설정
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                />
                <label htmlFor={`checkbox-${item.id}`}></label> 
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
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
            <div className={styles.totalSection}>
              <div className={styles.totalText}>
                Selected Total: KRW {totalPrice.toLocaleString()}
              </div>
              <button
                className={styles.checkoutButton}
                onClick={handleBuyNow} // 버튼은 항상 활성화
              >
                BUY NOW
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCart}>Your cart is empty.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
