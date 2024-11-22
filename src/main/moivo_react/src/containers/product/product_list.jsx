import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../assets/css/product_list.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import products from "../../assets/dummydata/productDTO";
import Modal from "../../components/Modal/Modal";

const ProductList = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [wishItems, setWishItems] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  // const [products, setProducts] = useState([]);

   // 더미데이터 대신 api 상품 데이터 가져오기
  //  useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:8080/api/store');
  //       setProducts(response.data);
  //     } catch (error) {
  //       console.error('상품 데이터를 불러오는데 실패했습니다:', error);
  //     }
  //   };
    
  //   fetchProducts();
  // }, []);

// API 연동 코드 (주석 처리)
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          storeAPI.getProducts(currentPage, sortBy),
          storeAPI.getCategories()
        ]);
        
        setProducts(productsData.content);
        setCategories(categoriesData.map(cat => cat.name));
        setTotalPages(productsData.totalPages);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortBy]);
  */


  const categories = ["all", "Outerwear", "Pants", "Jeans"];

  const filteredProducts = products.filter((product) =>
    activeCategory === "all"
      ? true
      : product.categoryid === categories.indexOf(activeCategory)
  );

  const sortProducts = () => {
    let sorted = [...filteredProducts];
    switch (sortBy) {
      case "priceHigh":
        return sorted.sort((a, b) => b.price - a.price);
      case "priceLow":
        return sorted.sort((a, b) => a.price - b.price);
      default:
        return sorted.sort((a, b) => b.id - a.id);
    }
  };

  const sortedProducts = sortProducts();

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      productimg: product.productimg,
      quantity: 1
    };
    setCartItems(prev => [...prev, cartProduct]);
    setIsCartModalOpen(true);
  };

  const handleAddToWish = (product) => {
    const wishProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      productimg: product.productimg
    };
    setWishItems(prev => [...prev, wishProduct]);
    setIsWishModalOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromWish = (id) => {
    setWishItems(prev => prev.filter(item => item.id !== id));
  };

  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);
  const openWishModal = () => setIsWishModalOpen(true);
  const closeWishModal = () => setIsWishModalOpen(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const goToDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productListWrapper}>
        <div className={styles.filterSection}>
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`${styles.categoryItem} ${
                  activeCategory === category ? styles.active : ''
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
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

        <motion.div 
          className={styles.productGrid}
          layout
        >
          {currentItems.map((product) => (
            <motion.div
              key={product.id}
              className={styles.productCard}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.productImageWrapper}>
                <img
                  src={product.productimg[0].fileurl}
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
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
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

        <Modal
          isOpen={isCartModalOpen}
          onClose={closeCartModal}
          title="장바구니"
          items={cartItems}
          onRemove={removeFromCart}
          onQuantityChange={updateCartQuantity}
        />
        <Modal
          isOpen={isWishModalOpen}
          onClose={closeWishModal}
          title="위시리스트"
          items={wishItems}
          onRemove={removeFromWish}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
