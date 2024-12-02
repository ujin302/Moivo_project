import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { PATH } from '../../../scripts/path';
import styles from '../../assets/css/product_detail.module.css';
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import LoadingModal from './LoadingModal';

const ProductDetail = () => {
  const { productId } = useParams(); // 받아온 상품 ID
  const { token } = useContext(AuthContext); // 토큰
  const [product, setProduct] = useState(null); // 상품 정보
  const [mainImage, setMainImage] = useState(''); // 메인 이미지
  const [thumbnailImages, setThumbnailImages] = useState([]); // 썸네일 이미지
  const [detailImages, setDetailImages] = useState([]); // 상세 이미지
  const [selectedSize, setSelectedSize] = useState(''); // 선택한 사이즈
  const [stocks, setStocks] = useState([]); // 재고 정보
  const [selectedProduct, setSelectedProduct] = useState(null); // 선택한 상품
  const [reviews, setReviews] = useState([]); // 리뷰 정보
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [quantity, setQuantity] = useState(1); // 수량
  const [activeTab, setActiveTab] = useState('details'); // 활성화된 탭

  const fetchProductDetail = async () => { // 상품 상세 정보 가져오기
    setLoading(true);
    setError(null);

    try {
      const headers = {}; // 헤더 초기화
      if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
      }
      // 토큰 포함
      
      console.log('Fetching product detail for ID:', productId); // 상품 ID 로깅
      const response = await axios.get(
        // `${PATH.SERVER}/api/store/product-detail/${productId}`,
        `${PATH.SERVER}/api/store/${productId}`,
        { headers }
      );

      console.log('API Response:', response.data); // API 응답 로깅

      if (!response.data) {
        throw new Error('상품 정보를 불러올 수 없습니다.');
      }

      const { product, imgList, stockList, reviewList } = response.data; // 상품, 이미지, 재고 정보 추출
      
      console.log(response.data);
      // 상품 정보가 없는 경우 처리
      if (!product) {
        throw new Error('상품 정보가 존재하지 않습니다.');
      }

      // 이미지 처리 전 로그
      console.log('처리할 이미지 목록:', imgList);

      // 이미지 설정 전 null 체크 추가
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
      
      // 재고 및 리뷰 정보 설정 전 로그
      console.log('설정할 재고 정보:', stockList);
      console.log('설정할 리뷰 정보:', reviewList);

      setStocks(stockList || []);
      setReviews(reviewList || []);
      

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

  useEffect(() => {
    console.log('현재 상태:', {
      product,
      mainImage,
      thumbnailImages,
      detailImages,
      stocks,
      reviews
    });
  }, [product, mainImage, thumbnailImages, detailImages, stocks, reviews]);

  const handleThumbnailClick = (imgUrl) => { // 썸네일 이미지 클릭 시 메인 이미지 변경
    setMainImage(imgUrl);
  };

  const handleSizeSelect = (size, count) => { // 사이즈 선택 시 선택한 상품 정보 설정
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

  const handlePurchase = () => { // 구매 버튼 클릭 시 선택한 상품 정보 출력
    if (!selectedProduct) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    // 구매 로직 구현
    console.log('구매하기:', selectedProduct);
  };

  const handleAddToWishlist = () => { // 위시리스트 버튼 클릭 시 선택한 상품 정보 출력
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    // 위시리스트 추가 로직 구현  
    console.log('위시리스트에 추가:', product.id);
  };

  const handleQuantityChange = (change) => { // 수량 변경 시 수량 업데이트
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

  const handleAddToCart = () => { // 장바구니 버튼 클릭 시 선택한 상품 정보 출력
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

  if (loading) { // 로딩 중일 때 로딩 모달 표시
    console.log('로딩 중...');
    return <LoadingModal isOpen={true} />;
  }

  if (error) { // 에러 발생 시 에러 메시지 표시
    console.log('에러 발생:', error);
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
    console.log('상품 정보 없음');
    return null;
  }

  return (
    <div className={styles.productDetailRoot}>
      <div className={styles.container}>
        <Banner />
        <motion.div 
          className={styles.productContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.imageSection}>
            <motion.div 
              className={styles.mainImageContainer}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={mainImage} 
                alt={product.name} 
                className={styles.mainImage}
              />
            </motion.div>
            <div className={styles.thumbnailContainer}>
              {thumbnailImages.map((img) => (
                <motion.img
                  key={img.id}
                  src={img.fileName}
                  alt={`${product.name} 썸네일`}
                  className={`${styles.thumbnail} ${mainImage === img.fileName ? styles.active : ''}`}
                  onClick={() => handleThumbnailClick(img.fileName)}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </div>

          <div className={styles.infoSection}>
            <motion.h1 
              className={styles.productName}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {product?.name || "상품명 정보가 없습니다."}
            </motion.h1>
            
            <motion.p 
              className={styles.price}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {product?.price?.toLocaleString()}원
            </motion.p>
            
            <motion.div 
              className={styles.sizeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className={styles.sizeHeading}>사이즈 선택</h3>
              <div className={styles.sizeGrid}>
                {stocks.map((stock) => (
                  <motion.button
                    key={stock.id}
                    className={`${styles.sizeButton} ${
                      selectedSize === stock.size ? styles.selected : ''
                    } ${stock.count <= 0 ? styles.soldOut : ''}`}
                    onClick={() => handleSizeSelect(stock.size, stock.count)}
                    disabled={stock.count <= 0}
                    whileHover={{ scale: stock.count > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: stock.count > 0 ? 0.95 : 1 }}
                  >
                    {stock.size}
                    <span className={styles.stock}>
                      {stock.count <= 0 ? '품절' : `(${stock.count})`}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {selectedProduct && (
              <motion.div 
                className={styles.selectedInfo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className={styles.selectedProductName}>선택된 상품: {product?.name}</p>
                <p className={styles.selectedSize}>사이즈: {selectedProduct.size}</p>
                <div className={styles.quantityControl}>
                  <motion.button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(-1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaMinus />
                  </motion.button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <motion.button 
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaPlus />
                  </motion.button>
                </div>
                <p className={styles.totalPrice}>총 가격: {(product?.price * quantity).toLocaleString()}원</p>
              </motion.div>
            )}

            <motion.div 
              className={styles.actionButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                className={styles.cartButton}
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart /> 장바구니
              </motion.button>
              <motion.button
                className={styles.purchaseButton}
                onClick={handlePurchase}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                구매하기
              </motion.button>
              <motion.button
                className={styles.wishlistButton}
                onClick={handleAddToWishlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHeart /> 위시리스트
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        <div className={styles.tabSection}>
          <div className={styles.tabButtons}>
            <motion.button
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
              whileHover={{ scale: 1.05 }}
            >
              상품 상세정보
            </motion.button>
            <motion.button
              className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
              whileHover={{ scale: 1.05 }}
            >
              리뷰
            </motion.button>
            <motion.button
              className={`${styles.tabButton} ${activeTab === 'qna' ? styles.active : ''}`}
              onClick={() => setActiveTab('qna')}
              whileHover={{ scale: 1.05 }}
            >
              QNA
            </motion.button>
            <motion.button
              className={`${styles.tabButton} ${activeTab === 'policy' ? styles.active : ''}`}
              onClick={() => setActiveTab('policy')}
              whileHover={{ scale: 1.05 }}
            >
              환불/교환정책
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              className={styles.tabContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'details' && (
                <div className={styles.detailSection}>
                  <div className={styles.detailContent}>
                    <p>{product.content}</p>
                  </div>
                  <div className={styles.detailImages}>
                    {detailImages.map((img) => (
                      <motion.img
                        key={img.id}
                        src={img.fileName}
                        alt="상품 상세 이미지"
                        className={styles.detailImage}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className={styles.reviewSection}>
                  <h2 className={styles.reviewHeading}>상품 리뷰</h2>
                  {reviews && reviews.length > 0 ? (
                    <div className={styles.reviewList}> 
                      {reviews.map((review) => (
                        <motion.div 
                          key={review.id} 
                          className={styles.review}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                        >
                          <div className={styles.reviewHeader}>
                            <span className={styles.rating}>★ {review.rating}</span>
                            <span className={styles.reviewAuthor}>{review.userName}</span>
                          </div>
                          <p className={styles.reviewContent}>{review.content}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noReviewContainer}>
                      <p className={styles.noReview}>리뷰가 존재하지 않습니다.</p>
                      <div className={styles.exampleReviews}>
                        <h3>리뷰 예시</h3>
                        <div className={styles.exampleReview}>
                          <div className={styles.reviewHeader}>
                            <span className={styles.rating}>★ 4.5</span>
                            <span className={styles.reviewAuthor}>홍길동</span>
                          </div>
                          <p className={styles.reviewContent}>
                            상품이 너무 마음에 들어요! 사이즈도 딱 맞고 배송도 빨랐습니다.
                            다음에도 구매하고 싶네요.
                          </p>
                        </div>
                        <div className={styles.exampleReview}>
                          <div className={styles.reviewHeader}>
                            <span className={styles.rating}>★ 5.0</span>
                            <span className={styles.reviewAuthor}>김철수</span>
                          </div>
                          <p className={styles.reviewContent}>
                            퀄리티가 정말 좋아요. 가격대비 만족스럽습니다!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'qna' && (
                <div className={styles.qnaSection}>
                  <h2 className={styles.sectionHeading}>상품 QNA</h2>
                  <div className={styles.qnaList}>
                    <div className={styles.qnaItem}>
                      <div className={styles.question}>
                        <span className={styles.qnaLabel}>Q.</span>
                        <p>사이즈가 평소 사이즈보다 작나요?</p>
                        <span className={styles.qnaAuthor}>- 구매예정자</span>
                      </div>
                      <div className={styles.answer}>
                        <span className={styles.qnaLabel}>A.</span>
                        <p>정사이즈로 제작되었습니다. 평소 신으시는 사이즈로 주문해주시면 됩니다.</p>
                        <span className={styles.qnaAuthor}>- 판매자</span>
                      </div>
                    </div>
                    <div className={styles.qnaItem}>
                      <div className={styles.question}>
                        <span className={styles.qnaLabel}>Q.</span>
                        <p>배송은 보통 얼마나 걸리나요?</p>
                        <span className={styles.qnaAuthor}>- 구매희망</span>
                      </div>
                      <div className={styles.answer}>
                        <span className={styles.qnaLabel}>A.</span>
                        <p>주문 후 1-2일 내에 출고되며, 출고 후 1-2일 내에 수령 가능합니다.</p>
                        <span className={styles.qnaAuthor}>- 판매자</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'policy' && (
                <div className={styles.policySection}>
                  <h2 className={styles.sectionHeading}>환불/교환 정책</h2>
                  <div className={styles.policyContent}>
                    <h3>교환/반품 안내</h3>
                    <ul>
                      <li>상품 수령 후 7일 이내에 교환/반품이 가능합니다.</li>
                      <li>제품에 하자가 있는 경우 무상으로 교환/반품이 가능합니다.</li>
                      <li>고객의 단순 변심으로 인한 교환/반품의 경우 배송비는 고객 부담입니다.</li>
                    </ul>
                    
                    <h3>교환/반품이 불가능한 경우</h3>
                    <ul>
                      <li>상품 수령 후 7일이 경과한 경우</li>
                      <li>착용한 흔적이 있거나 상품이 훼손된 경우</li>
                      <li>상품의 택이나 라벨이 제거된 경우</li>
                      <li>고객의 부주의로 인해 상품이 훼손된 경우</li>
                    </ul>

                    <h3>환불 안내</h3>
                    <ul>
                      <li>상품 회수 확인 후 3영업일 이내에 환불이 진행됩니다.</li>
                      <li>카드 결제의 경우 카드사에 따라 환불 처리 기간이 다소 차이가 있을 수 있습니다.</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetail;