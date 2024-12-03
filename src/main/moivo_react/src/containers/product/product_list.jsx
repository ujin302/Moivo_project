import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { PATH } from "../../../scripts/path";
import styles from "../../assets/css/product_list.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import ListModal from "./pro_components/list_modal";
import LoadingModal from "./LoadingModal";

const ProductList = () => {
  const { isLoggedIn, token } = useContext(AuthContext);
  const id = sessionStorage.getItem("id"); // 사용자 pk

  const [products, setProducts] = useState([]); // 상품 List
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ // 페이징 정보
    "isFirst" : false,  // 1 페이지 여부
    "isLast" : false, // 마지막 페이지 여부
    "hasPrevious" : false, // 이전 페이지 여부
    "hasNext" : false, // 다음 페이지 여부
    "totalPages" : 0, // 페이지 개수
    "startPage" : 0, // 블락 첫번째 페이지 수
    "endPage" : 0 // 블락 마지막 페이지 수
  });
  const pageBlock = 3;
  const itemsPerPage = 15; // 화면에 보여지는 상품 개수 

  const [sortBy, setSortBy] = useState("newest"); 
  // const categories = ["All", "Outer", "Top", "Bottom"]; // 카테고리
  const [categories, setCategories] = useState([{ id: 0, name: '전체' }]); // 카테고리 List
  const [activeCategory, setActiveCategory] = useState({ id: 0, name: '전체' });
  
  const [cartItem, setCartItem] = useState(0);
  const [wishItem, setWishItem] = useState(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // 24.11.28 - uj (수정)
  // 필요 Data 요청 & 저장
  const fetchProducts = async (page) => {
    setIsLoading(true);
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // 1. 상품 Data 요청
      const response = await axios.get(`${PATH.SERVER}/api/store`, {
        headers,
        params: {
          page: page,
          size: itemsPerPage,
          sortby: sortBy,
          keyword: searchTerm,
          block: pageBlock,
          categoryid: activeCategory.id
        }
      });
      
      if (response.data) {
        // 2. 상품 Data 저장
        setProducts(response.data.productList || []);
        setPageInfo({
          isFirst: response.data.isFirst,
          isLast: response.data.isLast,
          hasPrevious: response.data.hasPrevious,
          hasNext: response.data.hasNext,
          totalPages: response.data.totalPages,
          startPage: response.data.startPage,
          endPage: response.data.endPage
        });

        // 3. 카테고리 Data 저장
        setCategories([{ id: 0, name: '전체' }, ...response.data.category]);

        // 4. 사용자 Wish Data 요청
        if(id != null) {
          // 사용자 Wish & Cart Data
          getWishCartCount('wish');
          getWishCartCount('cart');
        }
        
        // 5. 현재 페이지 설정
        setCurrentPage(page);
        
        console.log(response.data);
        console.log(categories);
        console.log(products);
        console.log(pageInfo);
        console.log(currentPage);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("인증 오류:", error);
      } else {
        console.error("상품 목록을 가져오는 중 오류가 발생했습니다:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 렌더링
  useEffect(() => {
    fetchProducts(0);
  }, []);

  // 24.11.28 - uj
  // 사용자 Wish or Cart Data 요청
  const getWishCartCount = async (type) => {
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // 1. wish Data 요청
      const response = await axios.get(`${PATH.SERVER}/api/user/${type}/list`, {
        headers,
        params: {
          userid : id
        }
      });
  
      // 2. wish Data 저장
      switch (type) {
        case 'wish':
          setWishItem(response.data.wishlist.length);
        break;
        case 'cart':
          setCartItem(response.data.totalItems);
        break;
        default:
          break;
      }
      console.log(type, " 상품 개수: " + wishItem);
    } catch (error) {
      console.error("Error:", error.message, error.response);
      if (error.response?.status === 401) {
        console.error("인증 오류: ", error);
      } else {
        console.error("사용자 ", type, " 정보를 가져오는 중 오류가 발생했습니다: ", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 24.11.28 - uj
  // 카테고리, 정렬, 검색에 따른 상품 목록 렌더링
  useEffect(() => {
    fetchProducts(0);
  }, [sortBy, searchTerm, activeCategory]);

  // 11.28 - uj
  // Wish 아이템 추가 & 렌더링
  const handleAddToWish = async (product) => {
    try {
      if(id != null) {
        await axios.get(`${PATH.SERVER}/api/user/wish/${product.id}?userid=${id}`);
        console.log(`위시리스트에 상품(${product.id}) 추가 성공`);
        getWishCartCount('wish'); // 사용자 Wish Data 요청 호출
      } else {
        alert("로그인 후에 이용해주세요.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("인증 오류:", error);
      } else {
        console.error("위시리스트에 추가하는 중 오류가 발생했습니다:", error);
      }
    }
  };
  
  // Cart 아이템 추가
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
  
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img || '',
        quantity: 1,
      };
      setCartItems((prev) => [...prev, cartProduct]);
    }
    setIsCartModalOpen(true);
  };
  
  // Cart 아이템 제거
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Cart 아이템 수정
  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const closeCartModal = () => setIsCartModalOpen(false);
  
  // 상품 상세 화면 이동
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  // 11.28 - uj
  // wish 목록 이동
  const handleWishClick = () => {
    if(id != null) {
      navigate(`/mypage/wish`);
    } else {
      alert("로그인 후에 이용해주세요.");
    }
  }

  // 11.28 - uj
  // wish 목록 이동
  const handleCartClick = () => {
    if(id != null) {
      navigate(`/cart`);
    } else {
      alert("로그인 후에 이용해주세요.");
    }
  }

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productListWrapper}>
        {/* 상품 상단 */}
        <div className={styles.filterSection}>
          <div className={styles.searchAndCategories}>
            {/* 검색바 */}
            <motion.div
              className={`${styles.searchContainer} ${searchOpen ? styles.open : ''}`}
              animate={{ width: searchOpen ? "300px" : "40px" }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                className={styles.searchIcon}
                onClick={() => setSearchOpen(!searchOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-search" />
              </motion.button>
              <motion.input
                type="text"
                placeholder="상품 검색..."
                className={styles.searchInput}
                animate={{ opacity: searchOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
            {/* 카테고리 */}
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  className={`${styles.categoryItem} ${
                    activeCategory === category ? styles.active : ''
                  }`}
                  // onClick={() => setActiveCategory(category)}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.85 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
          {/* 정렬 */}
          <select
            className={styles.sortDropdown}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">최신순</option>
            <option value="priceHigh">높은 가격순</option>
            <option value="priceLow">낮은 가격순</option>
          </select>
        </div>

        {/* 상품 목록 */}
        <motion.div
          className={styles.productGrid}
          layout
          transition={{
            layout: { duration: 0.3 },
            opacity: { duration: 0.2 },
          }}
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className={styles.productCard}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.productImageWrapper}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div 
                    className={styles.productOverlay}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className={styles.actionButtons}>
                      <motion.button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-shopping-cart" />
                      </motion.button>
                      <motion.button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWish(product);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-heart" />
                      </motion.button>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productPrice}>
                      ₩{product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 페이징 처리 */}
        <motion.div className={styles.paginationContainer}>
          <button
            className={styles.pageButton}
            onClick={() => fetchProducts(0)}
            disabled={pageInfo.isFirst}
          >
            &laquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => fetchProducts(currentPage - 1)}
            disabled={!pageInfo.hasPrevious}
          >
            &lt;
          </button>
          {(() => {
            return Array.from({ length: pageInfo.endPage - pageInfo.startPage }, (_, index) => {
              const pageIndex = pageInfo.startPage + index;
              return (
                <button
                  key={pageIndex}
                  className={`${styles.pageButton} ${currentPage === pageIndex ? styles.active : ""}`}
                  onClick={() => fetchProducts(pageIndex)}
                >
                  {pageIndex + 1}
                </button>
              );
            });
          })()}
          <button
            className={styles.pageButton}
            onClick={() => fetchProducts(currentPage + 1)}
            disabled={!pageInfo.hasNext}
          >
            &gt;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => fetchProducts(pageInfo.totalPages - 1)}
            disabled={pageInfo.isLast}
          >
            &raquo;
          </button>
        </motion.div>

        <div className={styles.floatingButtonContainer}>
          <motion.div
            className={styles.floatingButton}
            data-totalitems={wishItem}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishClick}
          >
            <i className="fas fa-heart"></i>
          </motion.div>
          <motion.div
            className={styles.floatingButton}
            data-totalitems={cartItem}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCartClick}
          >
            <i className="fas fa-shopping-cart"></i>
          </motion.div>
        </div>

        {/* 모달 (장바구니) */}
        <ListModal
        isOpen={isCartModalOpen}
        onClose={closeCartModal}
        title="장바구니"
        items={cartItem}
        onRemove={removeFromCart}
        onQuantityChange={updateCartQuantity}
        isLoggedIn={isLoggedIn}
        navigate={navigate}
      />

        <LoadingModal isOpen={isLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;