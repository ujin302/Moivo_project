import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { PATH } from '../../../scripts/path';
import styles from '../../assets/css/product_detail.module.css';
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import LoadingModal from './LoadingModal';

const ProductDetail = () => {
  const { productId } = useParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [thumbnailImages, setThumbnailImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [stocks, setStocks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const fetchProductDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('Fetching product detail for ID:', productId);
      const response = await axios.get(
        `${PATH.SERVER}/api/store/product-detail/${productId}`,
        { headers }
      );

      console.log('API Response:', response.data);

      if (!response.data) {
        throw new Error('상품 정보를 불러올 수 없습니다.');
      }

      const { product, imgList, stockList } = response.data;
      
      // 상품 기본 정보 설정
      setProduct(product);
      
      // 메인 이미지 설정 (layer가 1인 이미지)
      const mainImg = imgList.find(img => img.layer === 1);
      setMainImage(mainImg ? mainImg.fileName : product.img);
      
      // 썸네일 이미지 설정 (layer가 2인 이미지들)
      const thumbnails = imgList.filter(img => img.layer === 2);
      setThumbnailImages(thumbnails);
      
      // 상세 이미지 설정 (layer가 3인 이미지들)
      const details = imgList.filter(img => img.layer === 3);
      setDetailImages(details);
      
      // 재고 정보 설정
      setStocks(stockList);

    } catch (error) {
      console.error('Error fetching product detail:', error);
      setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, [productId, token]);

  const handleThumbnailClick = (imgUrl) => {
    setMainImage(imgUrl);
  };

  const handleSizeSelect = (size, count) => {
    if (count <= 0) {
      alert('품절된 상품입니다.');
      return;
    }
    setSelectedSize(size);
    setSelectedProduct({
      id: product.id,
      size: size,
      count: 1
    });
  };

  const handlePurchase = () => {
    if (!selectedProduct) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    // 구매 로직 구현
    console.log('구매하기:', selectedProduct);
  };

  const handleAddToWishlist = () => {
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    // 위시리스트 추가 로직 구현  
    console.log('위시리스트에 추가:', product.id);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      if (selectedProduct) {
        setSelectedProduct({
          ...selectedProduct,
          count: newQuantity
        });
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    // 장바구니 추가 로직 구현
    console.log('장바구니에 추가:', { ...selectedProduct, quantity });
  };

  if (loading) {
    return <LoadingModal isOpen={true} />;
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <div className={styles.errorMessage}>{error}</div>
        <button 
          className={styles.retryButton}
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchProductDetail();
          }}
        >
          재시도
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productContainer}>
        <div className={styles.imageSection}>
          <div className={styles.mainImageContainer}>
            <img 
              src={mainImage} 
              alt={product.name} 
              className={styles.mainImage}
            />
          </div>
          <div className={styles.thumbnailContainer}>
            {thumbnailImages.map((img) => (
              <img
                key={img.id}
                src={img.fileName}
                alt={`${product.name} 썸네일`}
                className={styles.thumbnail}
                onClick={() => handleThumbnailClick(img.fileName)}
              />
            ))}
          </div>
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.productName}>{product?.name || "상품명 정보가 없습니다."}</h1>
          <p className={styles.price}>{product?.price?.toLocaleString() || "가격 정보가 없습니다."}</p>
          
          <div className={styles.sizeSection}>
            <h3>사이즈 선택</h3>
            <div className={styles.sizeGrid}>
              {stocks.map((stock) => (
                <button
                  key={stock.id}
                  className={`${styles.sizeButton} ${
                    selectedSize === stock.size ? styles.selected : ''
                  } ${stock.count <= 0 ? styles.soldOut : ''}`}
                  onClick={() => handleSizeSelect(stock.size, stock.count)}
                  disabled={stock.count <= 0}
                >
                  {stock.size}
                  <span className={styles.stock}>
                    {stock.count <= 0 ? '품절' : `(${stock.count})`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedProduct && (
            <div className={styles.selectedInfo}>
              <p>선택된 상품: {product?.name || "상품명 정보가 없습니다."}</p>
              <p>사이즈: {selectedProduct.size}</p>
              <p>수량: {selectedProduct.count}</p>
              <div className={styles.quantityControl}>
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              <p>총 가격: {(product?.price * quantity).toLocaleString()}원</p>
            </div>
          )}

          <div className={styles.actionButtons}>
            <motion.button
              className={styles.cartButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
            >
              장바구니
            </motion.button>
            <motion.button
              className={styles.purchaseButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePurchase}
            >
              구매하기
            </motion.button>
            <motion.button
              className={styles.wishlistButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToWishlist}
            >
              <FaHeart /> 위시리스트
            </motion.button>
          </div>
        </div>
      </div>

      <div className={styles.tabSection}>
        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
            onClick={() => setActiveTab('details')}
          >
            상품 상세정보
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            리뷰
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'qna' ? styles.active : ''}`}
            onClick={() => setActiveTab('qna')}
          >
            QNA
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'policy' ? styles.active : ''}`}
            onClick={() => setActiveTab('policy')}
          >
            환불/교환정책
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'details' && (
            <div className={styles.detailSection}>
              <div className={styles.content}>
                <p>{product.content}</p>
              </div>
              <div className={styles.detailImages}>
                {detailImages.map((img) => (
                  <img
                    key={img.id}
                    src={img.fileName}
                    alt="상품 상세 이미지"
                    className={styles.detailImage}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.reviewSection}>
              <h2>상품 리뷰</h2>
              {product.reviewList && product.reviewList.length > 0 ? (
                <div className={styles.reviewList}>
                  {product.reviewList.map((review) => (
                    <div key={review.id} className={styles.review}>
                      <p className={styles.reviewContent}>{review.content}</p>
                      <p className={styles.reviewAuthor}>{review.author}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noReview}>리뷰가 존재하지 않습니다.</p>
              )}
            </div>
          )}

          {activeTab === 'qna' && (
            <div className={styles.qnaSection}>
              <h2>상품 QNA</h2>
              {/* QNA 컴포넌트 구현 */}
              <p>준비중입니다.</p>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className={styles.policySection}>
              <h2>환불/교환 정책</h2>
              {/* 환불/교환 정책 내용 */}
              <p>준비중입니다.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;