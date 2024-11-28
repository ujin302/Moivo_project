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

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(
          `${PATH.SERVER}/api/store/product-detail/${productId}`,
          { 
            headers,
            withCredentials: true 
          }
        );

        if (!response.data || !response.data.id) {
          throw new Error('상품 정보를 불러올 수 없습니다.');
        }

        if (response.data) {
          const productData = response.data.product;
          const productImgs = response.data.productImgs || [];
          const productStocks = response.data.productStocks || [];

          // 이미지 분류
          const mainImg = productImgs.find(img => img.layer === 1);
          const thumbnails = productImgs.filter(img => img.layer === 2);
          const details = productImgs.filter(img => img.layer === 3);

          setProduct(productData);
          setMainImage(mainImg ? mainImg.fileName : productData.img);
          setThumbnailImages(thumbnails);
          setDetailImages(details);
          setStocks(productStocks);
        }
      } catch (e) {
        setError('상품 정보를 불러오는 중 오류가 발생했습니다.');
      }

      setLoading(false);
    };

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
            </div>
          )}

          <div className={styles.actionButtons}>
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

      <div className={styles.detailSection}>
        <h2>상품 상세 정보</h2>
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

      {product.reviewList && (
        <div className={styles.reviewSection}>
          <h2>상품 리뷰</h2>
          {product.reviewList.length > 0 ? (
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
      <Footer />
    </div>
  );
};

export default ProductDetail;