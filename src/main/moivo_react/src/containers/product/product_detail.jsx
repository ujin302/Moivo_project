import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { PATH } from '../../../scripts/path';
import axios from 'axios';
import styles from '../../assets/css/product_detail.module.css';
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import LoadingModal from './LoadingModal';

const ProductDetail = () => {
  const { productId } = useParams();
  const { isLoggedIn, token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [productImgs, setProductImgs] = useState([]);
  const [productStocks, setProductStocks] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(`${PATH.SERVER}/api/store/product-detail/${productId}`, {
          headers,
        });

        if (response.data) {
          setProduct(response.data.product);
          setProductImgs(response.data.productImgs);
          setProductStocks(response.data.productStocks);
          setMainImage(response.data.productImgs[0].fileName);
        }
      } catch (error) {
        console.error('상품 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId, token]);

  const handleThumbnailClick = (imgUrl) => {
    setMainImage(imgUrl);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    // 장바구니에 추가하는 로직 구현
  };

  const handleAddToWishlist = () => {
    // 위시리스트에 추가하는 로직 구현
  };

  if (isLoading || !product) {
    return <LoadingModal isOpen={isLoading} />;
  }

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
          <img src={mainImage} alt={product.name} className={styles.mainImage} />
          <div className={styles.thumbnailContainer}>
            {productImgs.map((img) => (
              <img
                key={img.id}
                src={img.fileName}
                alt={product.name}
                className={styles.thumbnail}
                onClick={() => handleThumbnailClick(img.fileName)}
              />
            ))}
          </div>
        </div>
        <div className={styles.infoContainer}>
          <h2>{product.name}</h2>
          <p className={styles.price}>{product.price.toLocaleString()}원</p>
          <div className={styles.sizeContainer}>
            <p>사이즈:</p>
            {productStocks.map((stock) => (
              <button
                key={stock.id}
                className={`${styles.sizeButton} ${
                  selectedSize === stock.size ? styles.selected : ''
                }`}
                onClick={() => handleSizeSelect(stock.size)}
              >
                {stock.size} ({stock.count})
              </button>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <motion.button
              className={styles.cartButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
              장바구니에 추가
            </motion.button>
            <motion.button
              className={styles.wishlistButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToWishlist}
            >
              <FaHeart />
              위시리스트에 추가
            </motion.button>
          </div>
        </div>
      </div>
      <div className={styles.detailContainer}>
        <h3>상품 상세 정보</h3>
        {product.detailImgs.map((img) => (
          <img key={img.id} src={img.fileName} alt={product.name} className={styles.detailImage} />
        ))}
      </div>
      <div className={styles.reviewContainer}>
        <h3>리뷰</h3>
        {product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <div key={review.id} className={styles.review}>
              <p className={styles.reviewContent}>{review.content}</p>
              <p className={styles.reviewAuthor}>{review.author}</p>
            </div>
          ))
        ) : (
          <p>리뷰가 존재하지 않습니다.</p>
        )}
        <div className={styles.exampleReview}>
          <p className={styles.reviewContent}>
            이 상품은 정말 마음에 듭니다. 품질도 좋고 디자인도 멋져요!
          </p>
          <p className={styles.reviewAuthor}>홍길동</p>
        </div>
      </div>
      <div className={styles.qnaContainer}>
        <h3>Q&A</h3>
        <div className={styles.qna}>
          <p className={styles.qnaQuestion}>이 상품은 어떤 소재로 만들어졌나요?</p>
          <p className={styles.qnaAnswer}>
            안녕하세요. 이 상품은 100% 면으로 제작되었습니다. 감사합니다.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;