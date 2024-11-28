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
  const { isLoggedIn, token } = useContext(AuthContext); // 인증 컨텍스트에서 토큰 가져오기
  const [categories, setCategories] = useState([]); // 동적으로 가져올 카테고리
  const [activeCategory, setActiveCategory] = useState("All"); // 선택된 카테고리 상태
  const [products, setProducts] = useState([]); // 상품 리스트
  const [sortBy, setSortBy] = useState("newest"); // 정렬 기준
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 15; // 한 페이지당 상품 개수
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]); // 장바구니 아이템
  const [wishItems, setWishItems] = useState([]); // 위시리스트 아이템
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // 장바구니 모달
  const [isWishModalOpen, setIsWishModalOpen] = useState(false); // 위시리스트 모달
  const [searchOpen, setSearchOpen] = useState(false); // 검색창 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // **카테고리 데이터 가져오기**
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${PATH.SERVER}/api/store`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.category) {
          setCategories([{ id: 0, name: "All" }, ...response.data.category]); // "All" 기본 추가
        } else {
          console.error("카테고리 데이터를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("카테고리 로드 중 오류 발생:", error);
      }
    };

    fetchCategories();
  }, [token]);

  // **상품 데이터 가져오기**
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // 로딩 상태 시작
      try {
        const headers = { Authorization: `Bearer ${token}` }; // 헤더 설정

        const response = await axios.get(`${PATH.SERVER}/api/store`, {
          headers,
          params: {
            page: currentPage - 1,
            size: itemsPerPage,
            sortby: sortBy,
            categoryid: activeCategory === "All" ? 0 : activeCategory, // "All"은 0으로 처리
            keyword: searchTerm,
          },
        });

        if (response.data && response.data.productList) {
          setProducts(response.data.productList); // 상품 리스트 설정
        } else {
          setProducts([]); // 데이터가 없을 경우 초기화
        }
      } catch (error) {
        console.error("상품 데이터 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchProducts();
  }, [activeCategory, sortBy, currentPage, searchTerm, token]);

  // **카테고리 클릭 핸들러**
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // 페이지를 첫 번째로 초기화
  };

  // **장바구니 추가 핸들러**
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }
    setIsCartModalOpen(true); // 모달 열기
  };

  // **위시리스트 추가 핸들러**
  const handleAddToWish = (product) => {
    if (!wishItems.find((item) => item.id === product.id)) {
      setWishItems((prev) => [...prev, product]);
      setIsWishModalOpen(true);
    }
  };

  // **상품 상세 보기 핸들러**
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productListWrapper}>
        <div className={styles.filterSection}>
          {/* 카테고리 필터 */}
          <div className={styles.searchAndCategories}>
            <motion.div
              className={`${styles.searchContainer} ${searchOpen ? styles.open : ""}`}
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
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  className={`${styles.categoryItem} ${
                    activeCategory === category.id ? styles.active : ""
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
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
                  <div className={styles.productOverlay}>
                    <div className={styles.actionButtons}>
                      <motion.button
                        className={styles.actionButton}
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-shopping-cart" />
                      </motion.button>
                      <motion.button
                        className={styles.actionButton}
                        onClick={() => handleAddToWish(product)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-heart" />
                      </motion.button>
                      <motion.button
                        className={styles.actionButton}
                        onClick={() => handleProductClick(product.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-eye" />
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

        <motion.div className={styles.paginationContainer}>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, index) => (
            <button
              key={index}
              className={`${styles.pageButton} ${
                currentPage === index + 1 ? styles.active : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          >
            &gt;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(Math.ceil(products.length / itemsPerPage))}
            disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          >
            &raquo;
          </button>
        </motion.div>

        <div className={styles.floatingButtonContainer}>
          <motion.div
            className={styles.floatingButton}
            data-totalitems={wishItems.length}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsWishModalOpen(true)}
          >
            <i className="fas fa-heart"></i>
          </motion.div>
          <motion.div
            className={styles.floatingButton}
            data-totalitems={cartItems.length}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartModalOpen(true)}
          >
            <i className="fas fa-shopping-cart"></i>
          </motion.div>
        </div>

        {/* 장바구니 모달 */}
        <ListModal
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          title="장바구니"
          items={cartItems}
          onRemove={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
          onQuantityChange={(id, quantity) =>
            setCartItems((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
              )
            )
          }
          isLoggedIn={isLoggedIn}
          navigate={navigate}
        />

        {/* 위시리스트 모달 */}
        <ListModal
          isOpen={isWishModalOpen}
          onClose={() => setIsWishModalOpen(false)}
          title="위시리스트"
          items={wishItems}
          onRemove={(id) => setWishItems((prev) => prev.filter((item) => item.id !== id))}
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
