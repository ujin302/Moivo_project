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
  
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  // 페이지 렌더링
  useEffect(() => {
    console.log("useEffect");
    
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(`${PATH.SERVER}/api/store`, {
          headers,
          params: {
            size: itemsPerPage,
            block: pageBlock
          }
        });
        
        if (response.data) {
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

          setCategories([{ id: 0, name: '전체' }, ...response.data.category]);


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

    fetchProducts();
  }, []);

  // 11.28 - uj
  // 페이지 넘어가기 
  const onClickPage = async (page) => {
    setIsLoading(true);
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log("page : " + page);
      // alert(sortBy)
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
      console.log(response.data);
      
      // DB 데이터 저장
      if (response.data) {
        // 상품 데이터 설정
        setProducts(response.data.productList || []);
        // 페이지 데이터 설정
        setPageInfo({
          isFirst: response.data.isFirst,
          isLast: response.data.isLast,
          hasPrevious: response.data.hasPrevious,
          hasNext: response.data.hasNext,
          totalPages: response.data.totalPages,
          startPage: response.data.startPage,
          endPage: response.data.endPage
        });
        // 현재 페이지 설정
        setCurrentPage(page);

        console.log(response.data);
        console.log(products);
        console.log(pageInfo);
        console.log("현재 페이지: " + currentPage);
      }
    } catch (error) {
      console.error("Error:", error.message, error.response);
      if (error.response?.status === 401) {
        console.error("인증 오류:", error);
      } else {
        console.error("상품 목록을 가져오는 중 오류가 발생했습니다:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 11.28 - uj
  // 카테고리, 정렬, 검색에 따른 상품 목록 렌더링
  useEffect(() => {
    onClickPage(0);
  }, [sortBy, searchTerm, activeCategory]);

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
  
  // Wish 아이템 추가
  const handleAddToWish = async (product) => {
    try {
      const id = sessionStorage.getItem("id");

      if(id != null) {
        await axios.get(`${PATH.SERVER}/api/user/wish/${product.id}?userid=${id}`);
        console.log(`위시리스트에 상품(${product.id}) 추가 성공`);
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

  // Wish 아이템 제거
  const removeFromWish = (productId) => {
    setWishItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);
  const openWishModal = () => setIsWishModalOpen(true);
  const closeWishModal = () => setIsWishModalOpen(false);

  // 상품 상세 화면 이동
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

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
                
                <h1>{product.id}</h1>
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

        {/* 페이징 처리 */}
        <motion.div className={styles.paginationContainer}>
          <button
            className={styles.pageButton}
            onClick={() => onClickPage(0)}
            disabled={pageInfo.isFirst}
          >
            &laquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => onClickPage(currentPage - 1)}
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
                  onClick={() => onClickPage(pageIndex)}
                >
                  {pageIndex + 1}
                </button>
              );
            });
          })()}
          <button
            className={styles.pageButton}
            onClick={() => onClickPage(currentPage + 1)}
            disabled={!pageInfo.hasNext}
          >
            &gt;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => onClickPage(pageInfo.totalPages - 1)}
            disabled={pageInfo.isLast}
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
        <ListModal
        isOpen={isCartModalOpen}
        onClose={closeCartModal}
        title="장바구니"
        items={cartItems}
        onRemove={removeFromCart}
        onQuantityChange={updateCartQuantity}
        isLoggedIn={isLoggedIn}
        navigate={navigate}
      />
      <ListModal
        isOpen={isWishModalOpen}
        onClose={closeWishModal}
        title="위시리스트"
        items={wishItems}
        onRemove={removeFromWish}
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