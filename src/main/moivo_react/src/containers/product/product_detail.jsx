import { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { PATH } from '../../../scripts/path';
import axios from 'axios';
import styles from '../../assets/css/product_detail.module.css';
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import LoadingModal from './LoadingModal';

const ProductDetail = () => {
  const { productId } = useParams();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [productImgs, setProductImgs] = useState({ thumbnails: [], details: [] });
  const [productStocks, setProductStocks] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
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
          const productData = response.data.product;
          const imgData = response.data.productImgs || [];
          const stockData = response.data.productStocks || [];

          // 이미지를 layer 값에 따라 분류
          const mainImg = imgData.find(img => img.layer === 1);
          const thumbnailImages = imgData.filter(img => img.layer === 2);
          const detailImages = imgData.filter(img => img.layer === 3);

          setProduct(productData);
          setMainImage(mainImg ? mainImg.fileName : '이미지 없음');
          setProductImgs({
            thumbnails: thumbnailImages,
            details: detailImages
          });
          setProductStocks(stockData);
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

  const handleSizeSelect = (size, count) => {
    if (count <= 0) {
      alert('품절된 상품입니다.');
      return;
    }
    setSelectedSize(size);
    setSelectedProduct({
      id: product.id,
      size: size,
      count: 1 // 기본 수량을 1로 설정
    });
  };

  const handlePurchase = () => {
    if (!selectedProduct) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    console.log('구매하기:', selectedProduct);
  };

  const handleAddToWishlist = () => {
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    console.log('위시리스트에 추가:', product.id);
  };

  if (isLoading || !product) {
    return <LoadingModal isOpen={isLoading} />;
  }

  return (
    <div className={styles.container}>
      <Banner />
      <div className={styles.productContainer}>
        <div className={styles.imageSection}>
          <div className={styles.mainImageContainer}>
            <img 
              src={mainImage} 
              alt={product.name || '상품 이미지'} 
              className={styles.mainImage} 
            />
          </div>
          <div className={styles.thumbnailContainer}>
            {productImgs.thumbnails.map((img) => (
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
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.price}>{product.price?.toLocaleString()}원</p>
          
          <div className={styles.sizeSection}>
            <h3>사이즈 선택</h3>
            <div className={styles.sizeGrid}>
              {productStocks.map((stock) => (
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
              <p>선택된 상품: {product.name}</p>
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
        <div className={styles.detailImages}>
          {productImgs.details.map((img) => (
            <img
              key={img.id}
              src={img.fileName}
              alt="상품 상세 이미지"
              className={styles.detailImage}
            />
          ))}
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h2>상품 리뷰</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className={styles.reviewList}>
            {product.reviews.map((review) => (
              <div key={review.id} className={styles.review}>
                <p className={styles.reviewContent}>{review.content}</p>
                <p className={styles.reviewAuthor}>{review.author}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noReview}>리뷰가 존재하지 않습니다.</p>
        )}

        <div className={styles.exampleReviewSection}>
          <h3>리뷰 예시</h3>
          <div className={styles.exampleReview}>
            <p className={styles.reviewContent}>
              이 상품은 정말 마음에 듭니다. 품질도 좋고 디자인도 멋져요!
            </p>
            <p className={styles.reviewAuthor}>홍길동</p>
          </div>
        </div>
      </div>

      <div className={styles.qnaSection}>
        <h2>Q&A</h2>
        <div className={styles.qna}>
          <div className={styles.question}>
            <p>Q: 이 상품은 어떤 소재로 만들어졌나요?</p>
          </div>
          <div className={styles.answer}>
            <p>A: 안녕하세요. 이 상품은 100% 면으로 제작되었습니다. 감사합니다.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;