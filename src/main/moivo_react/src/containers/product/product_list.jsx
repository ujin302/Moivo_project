import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "../../assets/css/product_list.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import Modal from "../../components/Modal/modal";

const ProductList = () => {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const headers = isLoggedIn ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get("/api/user/store", {
          headers: headers,
          params: {
            sortby: sortBy,
            categoryid: activeCategory === "All" ? 0 : categories.indexOf(activeCategory),
            keyword: searchTerm,
            page: currentPage - 1,
            size: itemsPerPage,
          },
        });

        console.log('서버 응답:', response.data);
        
        if (response.data) {
          const productList = response.data.productList || [];
          console.log('상품 목록:', productList);
          setProducts(productList);
        }
      } catch (error) {
        console.error("상품 목록을 가져오는 중 오류가 발생했습니다:", error);
      }
    };
  
    fetchProducts();
  }, [activeCategory, sortBy, currentPage, searchTerm, isLoggedIn, token]);

  const categories = ["All", "Outer", "Top", "Bottom"];

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      imgList: product.imgList ? product.imgList : [],
      quantity: 1,
    };
    setCartItems((prev) => [...prev, cartProduct]);
    setIsCartModalOpen(true);
  };

  const handleAddToWish = (product) => {
    const wishProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      imgList: product.imgList ? product.imgList : [],
    };
    setWishItems((prev) => [...prev, wishProduct]);
    setIsWishModalOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromWish = (productId) => {
    setWishItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);
  const openWishModal = () => setIsWishModalOpen(true);
  const closeWishModal = () => setIsWishModalOpen(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const goToDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productListWrapper}>
        <div className={styles.filterSection}>
          <div className={styles.searchAndCategories}>
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
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  className={`${styles.categoryItem} ${
                    activeCategory === category ? styles.active : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.85 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
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
            {currentItems.map((product) => (
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
                    src={product.imgList && product.imgList.length > 0 ? product.imgList[0].fileName : ""}
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
                        onClick={() => goToDetail(product.id)}
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
                    <p className={styles.productStock}>
                      재고: {product.stock}개
                      {/* 재고: {product.stockList && product.stockList.length > 0 ? product.stockList[0].stock : 0}개 */}
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
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ""}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
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
            onClick={openWishModal}
          >
            <i className="fas fa-heart"></i>
          </motion.div>
          <motion.div
            className={styles.floatingButton}
            data-totalitems={cartItems.length}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openCartModal}
          >
            <i className="fas fa-shopping-cart"></i>
          </motion.div>
        </div>

        {/* 모달 (장바구니, 위시리스트) */}
        <Modal
          isOpen={isCartModalOpen}
          onClose={closeCartModal}
          title="장바구니"
          items={cartItems}
          onRemove={removeFromCart}
          onQuantityChange={updateCartQuantity}
          isLoggedIn={isLoggedIn}
          navigate={navigate}
        />
        <Modal
          isOpen={isWishModalOpen}
          onClose={closeWishModal}
          title="위시리스트"
          items={wishItems}
          onRemove={removeFromWish}
          isLoggedIn={isLoggedIn}
          navigate={navigate}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;