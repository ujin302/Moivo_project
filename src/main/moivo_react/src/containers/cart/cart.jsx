import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/Cart.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const userId = 3; // 임의의 userId

  useEffect(() => {
    // 서버에서 장바구니 데이터 가져오기
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/cart/list`, {
          params: { userid: userId },
        });
        setCartItems(response.data.cartItems || []);
        console.log(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchCartItems();
  }, [userId]);

  // 사이즈 변경 핸들러
  const handleSizeChange = (id, size) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, size } : item
      )
    );
  };

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
  const handleRemoveItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/cart/delete/${id}`, {
        params: { userid: userId },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSelectedItems((prevSelected) =>
        prevSelected.filter((itemId) => itemId !== id)
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // 선택된 항목만 결제 페이지로 이동
  const handleBuyNow = () => {
    if (selectedItems.length === 0) {
      alert("선택한 항목이 없습니다. 항목을 선택해주세요.");
      return;
    }
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    navigate("/payment", { state: { items: selectedCartItems } });
  };

  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);
   
  if (loading) {
    return <div>Loading...</div>;
  }

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
                  id={`checkbox-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelectItem(item.id)}
                />
                <label htmlFor={`checkbox-${item.id}`}></label>
                <div className={styles.productImage}>
                  <img src={item.image || "../image/default.jpg"} alt={item.name} />
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.productPrice}>
                    KRW {item.price.toLocaleString()}
                  </div>
                  <div className={styles.sizeSelector}>
                    <label htmlFor={`size-${item.id}`}>Size:</label>
                    <select
                      id={`size-${item.id}`}
                      value={item.size}
                      onChange={(e) => handleSizeChange(item.id, e.target.value)}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                  </div>
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() => handleQuantityChange(item.id, "decrease")}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, "increase")}
                    >
                      +
                    </button>
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
              <button className={styles.checkoutButton} onClick={handleBuyNow}>
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