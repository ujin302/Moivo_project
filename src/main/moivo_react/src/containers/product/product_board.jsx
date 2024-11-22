// src/containers/product/ProductBoard.jsx
import React, { useState, useEffect } from 'react';
import Slider from "../../components/Slider/Slider";
import styles from "../../assets/css/product_board.module.css";
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ProductBoard = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [trendingItems, setTrendingItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherFashion, setWeatherFashion] = useState([]);

  // 날씨 API 호출
  // const getWeather = async () => {
  //   try {
  //     const position = await new Promise((resolve, reject) => {
  //       navigator.geolocation.getCurrentPosition(resolve, reject);
  //     });
  //     
  //     const { latitude, longitude } = position.coords;
  //     const response = await axios.get(
  //       `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
  //     );
  //     
  //     setWeather(response.data);
  //     getWeatherFashion(response.data.main.temp, response.data.weather[0].main);
  //   } catch (error) {
  //     console.error('날씨 정보 가져오기 실패:', error);
  //   }
  // };

  // AI 패션 추천 API 호출
  // const getWeatherFashion = async (temp, weatherCondition) => {
  //   try {
  //     const response = await axios.post('/api/fashion/recommend', {
  //       temperature: temp,
  //       weather: weatherCondition
  //     });
  //     setWeatherFashion(response.data.recommendations);
  //   } catch (error) {
  //     console.error('패션 추천 가져오기 실패:', error);
  //   }
  // };

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 날씨 정보 초기 로드
  // useEffect(() => {
  //   getWeather();
  // }, []);

  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className={styles.productBoardContainer}>
      <Banner />
      
      {/* 트렌딩 섹션 */}
      <motion.div 
        className={styles.contentWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* 트렌딩 섹션 개선 */}
        <motion.section 
          className={styles.trendingSection}
          {...fadeInUp}
        >
          <h2 className={styles.sectionTitle}>Trending Now</h2>
          <Slider />
        </motion.section>


        {/* 날씨 패션 섹션 */}
        <motion.section 
          className={styles.weatherFashionSection}
          {...fadeInUp}
        >
          <h2 className={styles.sectionTitle}>Today's Weather Fashion</h2>
          <div className={styles.comingSoon}>
            <motion.div 
              className={styles.comingSoonContent}
              whileHover={{ scale: 1.02 }}
            >
              <h3>서비스 준비중</h3>
              <p>날씨에 맞는 패션 추천 서비스가 곧 제공될 예정입니다.</p>
              <motion.div 
                className={styles.comingSoonIcon}
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🌤️ 👕
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ 섹션 개선 */}
        <motion.section 
          className={styles.faqSection}
          {...fadeInUp}
        >
          <h3>자주 묻는 질문</h3>
          <details>
            <summary>교환 및 환불이 가능한가요?</summary>
            <p>상품 수령 후 7일 이내에 가능합니다.</p>
          </details>
          <details>
            <summary>배송은 얼마나 걸리나요?</summary>
            <p>주문 후 3~5일 이내에 배송됩니다.</p>
          </details>
        </motion.section>

        {/* 브랜드 스토리 섹션 개선 */}
        <motion.section 
          className={styles.brandStory}
          {...fadeInUp}
        >
          <h2>Our Story</h2>
          <div className={styles.storyContent}>
            <div className={styles.storyImage}></div>
            <div className={styles.storyText}>
              <h3>Timeless Elegance</h3>
              <p>우리는 시간이 지나도 변치 않는 스타일을 추구합니다.</p>
            </div>
          </div>
        </motion.section>

        {/* 디자인 철학 섹션 */}
        <motion.section 
          className={styles.philosophySection}
          {...fadeInUp}
        >
          <h2 className={styles.sectionTitle}>Design Philosophy</h2>
          <div className={styles.philosophyGrid}>
            <motion.div 
              className={styles.philosophyCard}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.philosophyIcon}>✨</div>
              <h3>Timeless Beauty</h3>
              <p>시간이 흘러도 변치 않는 아름다움</p>
            </motion.div>
            <motion.div 
              className={styles.philosophyCard}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.philosophyIcon}>🌿</div>
              <h3>Sustainable Fashion</h3>
              <p>환경을 생각하는 지속 가능한 패션</p>
            </motion.div>
            <motion.div 
              className={styles.philosophyCard}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.philosophyIcon}>💫</div>
              <h3>Modern Elegance</h3>
              <p>현대적 감각의 우아함</p>
            </motion.div>
          </div>
        </motion.section>

        {/* 시즌 컬렉션 쇼케이스 */}
        <motion.section 
          className={styles.seasonShowcase}
          {...fadeInUp}
        >
          <h2 className={styles.sectionTitle}>Season Collection</h2>
          <div className={styles.seasonGrid}>
            {[
              { 
                season: 'Spring', 
                desc: '봄의 새로움을 담은 컬렉션', 
                image: 'https://images.unsplash.com/photo-1522682078546-47888fe04e81',
                items: ['플로럴 원피스', '라이트 데님', '트렌치코트'] 
              },
              { 
                season: 'Summer', 
                desc: '여름의 청량감을 담은 컬렉션', 
                image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
                items: ['린넨 셔츠', '와이드 팬츠', '스트로 햇'] 
              },
              { 
                season: 'Fall', 
                desc: '가을의 따스함을 담은 컬렉션', 
                image: 'https://images.unsplash.com/photo-1511401139252-f158d3209c17',
                items: ['니트 카디건', '울 코트', '앵클부츠'] 
              },
              { 
                season: 'Winter', 
                desc: '겨울의 포근함을 담은 컬렉션', 
                image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b',
                items: ['캐시미어 코트', '터틀넥', '울 스카프'] 
              }
            ].map((item) => (
              <motion.div 
                key={item.season}
                className={styles.seasonCard}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.seasonImage} style={{backgroundImage: `url(${item.image})`}}>
                  <div className={styles.seasonOverlay}>
                    <h3>{item.season}</h3>
                  </div>
                </div>
                <div className={styles.seasonContent}>
                  <h4>{item.desc}</h4>
                  <ul className={styles.seasonItems}>
                    {item.items.map((piece, index) => (
                      <li key={index}>{piece}</li>
                    ))}
                  </ul>
                  <motion.button 
                    className={styles.seasonBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    자세히 보기
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 스타일 가이드 섹션 */}
        <motion.section 
          className={styles.styleGuide}
          {...fadeInUp}
        >
          <h2 className={styles.sectionTitle}>Style Guide</h2>
          <div className={styles.styleGrid}>
            {[
              {
                title: 'Casual Chic',
                image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
                tips: ['베이직한 아이템 매칭', '편안하면서도 세련된 스타일링'],
                color: '#F9DCC4'
              },
              {
                title: 'Business Casual',
                image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2',
                tips: ['프로페셔널한 룩', '세미 포멀 스타일링'],
                color: '#E7E0C9'
              },
              {
                title: 'Street Fashion',
                image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
                tips: ['트렌디한 믹스매치', '개성있는 레이어링'],
                color: '#C1D0B5'
              },
              {
                title: 'Romantic Date',
                image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b',
                tips: ['여성스러운 실루엣', '포인트 액세서리 활용'],
                color: '#F6E6E4'
              }
            ].map((style) => (
              <motion.div 
                key={style.title}
                className={styles.styleCard}
                style={{backgroundColor: style.color}}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              >
                <div className={styles.styleImageWrapper}>
                  <div 
                    className={styles.styleImage}
                    style={{backgroundImage: `url(${style.image})`}}
                  />
                </div>
                <div className={styles.styleContent}>
                  <h3>{style.title}</h3>
                  <ul className={styles.styleTips}>
                    {style.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                  <motion.button 
                    className={styles.styleBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    스타일 가이드 보기
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </motion.div>

      {/* 스크롤 버튼 개선 */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className={styles.scrollTopBtn}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductBoard;
