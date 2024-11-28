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
  const [loading, setLoading] = useState(true);
  const userid = 3;

  useEffect(() => {

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/cart/list`, {
          params: { userid },
        });
        const fetchedItems = response.data.cartItems || [];
        // productDTO 데이터를 포함하여 필요한 구조로 변환
        const mappedItems = fetchedItems.map((item) => ({
          ...item,
          ...item.productDTO, // productDTO 데이터 병합

        }));
        console.log("fetchedItems = " + fetchedItems);
        console.log("mappedItems = " + mappedItems);
        setCartItems(mappedItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [userid]);

  console.log(cartItems);


  const handleRemoveItem = async (id) => {
    const token = sessionStorage.getItem("token");
    console.log("token = " + token);
  
    console.log("Removing item with id:", id);
    try {
      await axios.delete(`http://localhost:8080/api/user/cart/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰이 제대로 전달되는지 확인
        },
        params: { userid },
      });
      // 상태 업데이트에서 id를 사용
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log(`Item with id ${id} removed successfully`);
    } catch (error) {
      console.error("Error removing item:", error);
      if (error.response?.status === 401) {
        alert("인증이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.");
      } else {
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  const handleUpdateItem = async (cartId, newCount, newSize) => {
    const token = sessionStorage.getItem("token");
    console.log(token);
    console.log("cartId = " + cartId);

    if (!token) {
      console.error("No token found, user might not be authenticated.");
      alert("로그인 후 다시 시도해 주세요.");
      return;
    }
    
    try {
      await axios.put(
        `http://localhost:8080/api/user/cart/update/${cartId}`,
        {
          count: newCount, // 변경할 카운트
          size: newSize,   // 변경할 사이즈
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // 상태 업데이트
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.cartid))
    .reduce((total, item) => total + item.price * item.count, 0);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Banner />
      <div className={styles.cartFrame}>
        <div className={styles.title}>CART</div>
        {cartItems.length > 0 ? (
          <div className={styles.cartContainer}>
            {cartItems.map((item) => (
              <div key={item.cartId} className={styles.cartItem}>
                <input
                  type="checkbox"
                  id={`checkbox-${item.cartId}`}
                  checked={selectedItems.includes(item.cartId)}
                  onChange={() =>
                    setSelectedItems((prev) =>
                      prev.includes(item.cartId)
                        ? prev.filter((id) => id !== item.cartId)
                        : [...prev, item.cartId]
                    )
                  }
                />
                <label htmlFor={`checkbox-${item.cartId}`}></label>
                <div className={styles.productImage}>
                  <img src={item.img || "../image/default.jpg"} alt={item.name} />
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.productContent}>{item.content}</div>
                  <div className={styles.productPrice}>KRW {item.price.toLocaleString()}</div>
                    <div className={styles.sizeSelector}>
                    <select
                      id={`size-select-${item.cartId}`}
                      value={item.size}
                      onChange={(e) => handleUpdateItem(item.cartId, null, e.target.value)}
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                    </div>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => {
                          if (item.count > 1) handleUpdateItem(item.cartId, item.count - 1, null);
                        }}
                      >
                        -
                      </button>
                      <span>{item.count}</span>
                      <button
                        onClick={() => handleUpdateItem(item.cartId, item.count + 1, null)}
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
              <button
                className={styles.checkoutButton}
                onClick={() =>
                  navigate("/payment", {
                    state: { items: cartItems.filter((item) => selectedItems.includes(item.cartId)) },
                  })
                }
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