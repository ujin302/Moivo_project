import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/Cart.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { PATH } from "../../../scripts/path";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userid = 3;

  // 장바구니 데이터 가져오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${PATH.SERVER}/api/user/cart/list`, {
          params: { userid },
        });
        const fetchedItems = response.data.cartItems || [];
        const mappedItems = fetchedItems.map((item) => ({
          ...item,
          ...item.productDTO, // productDTO 데이터 병합
          usercartId: item.id, // usercart의 id를 별도로 저장
        }));
        setCartItems(mappedItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [userid]);

  // 상품 제거
  const handleRemoveItem = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${PATH.SERVER}/api/user/cart/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userid },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      console.log(`${id} 상품 삭제 성공 ~`);
    } catch (error) {
      console.error("Error removing item:", error);
      if (error.response?.status === 401) {
        alert("인증이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.");
      } else {
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  // 상품 업데이트
  const handleUpdateItem = async (id, newCount, newSize) => {
    const token = localStorage.getItem("accessToken");
    const item = cartItems.find((item) => item.usercartId === id);
    if (newCount > item.stockCount) {
      alert("재고를 초과할 수 없습니다.");
      return;
    }
    try {
      await axios.put(
        `${PATH.SERVER}/api/user/cart/update/${id}`,
        {
          count: newCount,
          size: newSize !== null ? newSize : item.size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.usercartId === id
            ? { ...item, count: newCount, size: newSize !== null ? newSize : item.size }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("수정 중 문제가 발생했습니다. !!");
    }
  };

  // 선택된 상품의 총 가격 계산
  const totalPrice = cartItems
    .filter((item) => selectedItems.includes(item.usercartId))
    .reduce((total, item) => total + item.price * item.count, 0);

  // 결제 페이지로 이동
  const handleNavigateToPayment = () => {
    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요.");
      return; // 아무것도 선택되지 않으면 함수 종료
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.usercartId)
    );
    navigate("/payment", { state: { cartItems: selectedCartItems } });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Banner />
      <div className={styles.cartFrame}>
        <div className={styles.title}>CART</div>
        {cartItems.length > 0 ? (
          <div className={styles.cartContainer}>
            {cartItems.map((item) => (
              <div key={item.usercartId} className={styles.cartItem}>
                {/* 품절 상품 체크 불가 */}
                <input
                  type="checkbox"
                  id={`${item.usercartId}`}
                  checked={selectedItems.includes(item.usercartId)}
                  disabled={item.soldOut}
                  onChange={() =>
                    setSelectedItems((prev) =>
                      prev.includes(item.usercartId)
                        ? prev.filter((id) => id !== item.usercartId)
                        : [...prev, item.usercartId]
                    )
                  }
                />
                <label htmlFor={`${item.usercartId}`}></label>
                <div className={styles.productImage}>
                  <img src={item.img || "../image/default.jpg"} alt={item.name} />
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productName}>{item.name}</div>
                  <div className={styles.productContent}>{item.content}</div>
                  <div className={styles.productPrice}>
                    KRW {item.price.toLocaleString()}
                  </div>
                  {item.soldOut && (
                    <div className={styles.soldOutMessage}>품절된 상품입니다.</div>
                  )}
                  {!item.soldOut ? (
                    <div className={styles.sizeSelector}>
                      <select
                        id={`size-select-${item.usercartId}`}
                        value={item.size}
                        onChange={(e) =>
                          handleUpdateItem(item.usercartId, item.count, e.target.value)
                        }
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                      </select>
                      <button
                        onClick={() => {
                          if (item.count > 1) handleUpdateItem(item.usercartId, item.count - 1, null);
                        }}
                      >
                        -
                      </button>
                      <span>{item.count}</span>
                      <button
                        onClick={() => {
                          if (item.count < item.stockCount) {
                            handleUpdateItem(item.usercartId, item.count + 1, null);
                          } else {
                            alert("재고를 초과할 수 없습니다.");
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div>변경할 수 없습니다.</div>
                  )}
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={item.soldOut}
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
                onClick={handleNavigateToPayment}
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
