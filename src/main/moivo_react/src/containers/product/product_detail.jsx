import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../assets/css/product_detail.module.css";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import LoadingModal from "./LoadingModal";
import axios from "axios";

const ProductDetail = () => {
  const { isLoggedIn, token } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 필요한 상태들 선언
  const [productData, setProductData] = useState(location.state?.productData || null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // 상품 기본 정보
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  
  // 이미지 관련
  const [productImages, setProductImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  // 리뷰 관련
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('상품정보');

  // 위시리스트 관련
  const [isInWishlist, setIsInWishlist] = useState(false);

  // 상품 상세 정보 관련
  const [productDetail, setProductDetail] = useState({
    Product: null,
    Category: null,
    ImgList: [],
    Stock: {},
    ReviewList: []
  });

  // 이미지 관련
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailImages, setThumbnailImages] = useState([]);

  // 재고 관련
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  // const [stockData, setStockData] = useState([]);
  // const [selectedSize, setSelectedSize] = useState("");
  // const [selectedStock, setSelectedStock] = useState(null);
  // const [quantity, setQuantity] = useState(1);

  // 리뷰 관련
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productData) {
      const fetchProductData = async () => {
        setIsLoading(true);
        try {
          const headers = {
            'Content-Type': 'application/json'
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await axios.get(`/api/user/store/${id}`, {
            headers: headers
          });

          if (response.data) {
            // 상품 기본 정보 설정
            setProduct(response.data.Product);
            setCategory(response.data.Category);
            
            // 이미지 정보 설정
            const sortedImages = response.data.ImgList.sort((a, b) => a.layer - b.layer);
            setProductImages(sortedImages);
            const mainImg = sortedImages.find(img => img.layer === 1);
            if (mainImg) {
              setMainImage(mainImg.fileName);
            }
            
            // 재고 정보 설정
            const stockInfo = response.data.Stock;
            const sizes = Object.keys(stockInfo).filter(size => stockInfo[size] > 0);
            setAvailableSizes(sizes);
            if (sizes.length > 0) {
              setSelectedSize(sizes[0]);
            }
            
            // 리뷰 정보 설정
            const reviewList = response.data.ReviewList;
            setReviews(reviewList);
            const totalRating = reviewList.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(reviewList.length > 0 ? totalRating / reviewList.length : 0);
            setReviewCount(reviewList.length);

            // 전체 데이터 저장
            setProductData(response.data);
          }
        } catch (error) {
          console.error("상품 데이터를 가져오는데 실패했습니다:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProductData();
    } else {
      // 이미 데이터가 있는 경우 초기 설정
      setProduct(productData.Product);
      setCategory(productData.Category);
      setProductImages(productData.ImgList.sort((a, b) => a.layer - b.layer));
      const mainImg = productData.ImgList.find(img => img.layer === 1);
      if (mainImg) {
        setMainImage(mainImg.fileName);
      }
      setReviews(productData.ReviewList);
      
      const stockInfo = productData.Stock;
      const sizes = Object.keys(stockInfo).filter(size => stockInfo[size] > 0);
      setAvailableSizes(sizes);
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      }
      
      setIsLoading(false);
    }
  }, [id, token, productData]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productData || !productData.fromList) { // 리스트에서 오지 않았거나 데이터가 없는 경우에만 새로 요청
        setIsLoading(true);
        try {
          const headers = {
            'Content-Type': 'application/json'
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await axios.get(`/api/user/store/${id}`, {
            headers: headers
          });

          if (response.data) {
            setProductDetail(response.data);
            // 이미지 처리
            const images = response.data.ImgList.sort((a, b) => a.layer - b.layer);
            setThumbnailImages(images);
            
            // 재고 처리
            const stockData = response.data.Stock;
            setAvailableSizes(Object.keys(stockData).filter(size => stockData[size] > 0));
            
            // 리뷰 처리
            const reviews = response.data.ReviewList;
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating(reviews.length > 0 ? totalRating / reviews.length : 0);
            setReviewCount(reviews.length);
          }
        } catch (error) {
          console.error("상품 상세 정보를 가져오는데 실패했습니다:", error);
          if (error.response?.status === 401) {
            // 401 에러 발생 시 로그인 페이지로 리다이렉트
            navigate('/user');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // 리스트에서 전달받은 데이터 사용
        setProductDetail(productData);
        // ... 나머지 데이터 처리 ...
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, token, productData, navigate]);

  // 구매 핸들러 추가
  const handlePurchase = () => {
    if (!isLoggedIn) {
      navigate('/user');
    } else {
      console.log('구매 기능 준비 중');
    }
  };

  /* ===== TAB CONTENT RENDERER ===== */
  const renderTabContent = () => {
    switch (activeTab) {
      case '상품정보':
        return (
          <div className={styles.detailImages}>
            {product?.productimg.map((img) => (
              <img
                key={img.id}
                src={img.fileurl}
                alt={`${product.name} 상세이미지`}
                className={styles.detailImage}
              />
            ))}
          </div>
        );
      case '리뷰':
        return (
          <div className={styles.reviewSection}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewUser}>{review.username}</span>
                  <span className={styles.reviewDate}>{review.date}</span>
                </div>
                <div className={styles.reviewRating}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                </div>
                <p className={styles.reviewContent}>{review.content}</p>
              </div>
            ))}
          </div>
        );
      case 'Q&A':
        return (
          <div className={styles.qnaSection}>
            <div className={styles.qnaHeader}>
              <h3>상품 Q&A</h3>
              <button className={styles.writeButton}>문의하기</button>
            </div>
            <p className={styles.qnaGuide}>
              - 상품에 대한 문의사항을 남겨주세요.
              <br />
              - 배송/교환/반품 문의는 고객센터를 이용해주세요.
            </p>
            {/* Q&A 목록이 있다면 여기에 추가 */}
          </div>
        );
      case '배송/교환/반품':
        return (
          <div className={styles.shippingSection}>
            <div className={styles.shippingInfo}>
              <h3>배송 안내</h3>
              <ul>
                <li>배송방법: 택배</li>
                <li>배송지역: 전국</li>
                <li>배송비용: 3,000원 (30,000원 이상 구매 시 무료배송)</li>
                <li>배송기간: 2-3일 소요 (주말/공휴일 제외)</li>
              </ul>
            </div>
            <div className={styles.exchangeInfo}>
              <h3>교환/반품 안내</h3>
              <ul>
                <li>교환/반품 기간: 상품 수령 후 7일 이내</li>
                <li>교환/반품 배송비: 6,000원 (왕복)</li>
                <li>교환/반품 불가사유: 착용 흔적, 오염, 택 제거 등</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  /* ===== ERROR HANDLING ===== */
  if (!product) {
    return (
      <div>
        <h1>Product Not Found</h1>
        <p>해당 상품이 존재하지 않습니다.</p>
      </div>
    );
  }

  /* ===== RENDER ===== */
  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <Banner />
      
      <div className={styles.productDetailWrapper}>
        {/* 상단 섹션: 이미지와 구매 정보 */}
        <div className={styles.topSection}>
          {/* 왼쪽: 메인 이미지 섹션 */}
          <div className={styles.mainImageSection}>
            {/* 메인 이미지 */}
            <div className={styles.mainImageWrapper}>
              <img
                src={mainImg || "/placeholder.jpg"}
                alt={product?.name}
                className={styles.mainImage}
              />
            </div>
            
            {/* 섬네일 캐러셀 */}
            <div className={styles.thumbnailSection}>
              <button 
                className={`${styles.carouselButton} ${styles.prevButton}`}
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                ‹
              </button>
              
              <div className={styles.thumbnailWrapper}>
                {product?.productimg.slice(currentSlide, currentSlide + slidesPerView).map((img) => (
                  <div 
                    key={img.id || img.fileurl}
                    className={`${styles.thumbnailItem} ${mainImg === img.fileurl ? styles.activeThumbnail : ''}`}
                    onClick={() => setMainImg(img.fileurl)}
                  >
                    <img 
                      src={img.fileurl} 
                      alt={product.name} 
                      className={styles.thumbnail}
                    />
                  </div>
                ))}
              </div>

              <button 
                className={`${styles.carouselButton} ${styles.nextButton}`}
                onClick={nextSlide}
                disabled={currentSlide >= product?.productimg.length - slidesPerView}
              >
                ›
              </button>
            </div>
          </div>

          {/* 오른쪽: 구매 정보 섹션 */}
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
            <div className={styles.description}>
              <p>{product.content}</p>
            </div>
            
            {/* 구매 옵션 */}
            <div className={styles.purchaseOptions}>
              <div className={styles.optionRow}>
                <span className={styles.optionLabel}>사이즈</span>
                <div className={styles.optionContent}>
                  <select
                    value={selectedSize}
                    onChange={handleSizeChange}
                    className={styles.sizeSelect}
                  >
                    <option value="">선택해주세요</option>
                    {stockData.map(stock => (
                      <option 
                        key={stock.id} 
                        value={stock.size}
                        disabled={stock.count === 0}
                      >
                        {stock.size} {stock.count === 0 ? '(품절)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedStock && (
                <div className={styles.optionRow}>
                  <span className={styles.optionLabel}>수량</span>
                  <div className={styles.optionContent}>
                    <div className={styles.quantityWrapper}>
                      <button 
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={selectedStock.count}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        readOnly
                      />
                      <button 
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= selectedStock.count}
                      >
                        +
                      </button>
                    </div>
                    <span className={styles.stockInfo}>
                      (재고: {selectedStock.count}개)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className={styles.actionButtons}>
              <motion.button 
                className={`${styles.actionBtn} ${styles.purchaseButton}`}
                onClick={handlePurchase}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart /> 구매하기
              </motion.button>
              <motion.button 
                className={`${styles.actionBtn} ${styles.wishlistButton}`}
                onClick={handleWishlist}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaHeart /> 위시리스트
              </motion.button>
            </div>
          </div>
        </div>

        {/* 하단 섹션: 상세 정보 탭 */}
        <div className={styles.bottomSection}>
          {/* 탭 메뉴 */}
          <div className={styles.detailTabs}>
            {['상품정보', '리뷰', 'Q&A', '배송/교환/반품'].map((tab) => (
              <button
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab} {tab === '리뷰' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          {/* 탭 컨텐츠 */}
          <div className={styles.detailContent}>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* 푸터 영역 */}
      <Footer />
      
      {/* LoadingModal 추가 */}
      <LoadingModal isOpen={isLoading} />
    </div>
  );
};

export default ProductDetail;