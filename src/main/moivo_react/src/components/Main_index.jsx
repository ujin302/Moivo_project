import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../assets/css/Main_index.module.css';
import video from '../assets/image/main_banner1.mp4';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthContext } from '../contexts/AuthContext';

//확인하기 위해 아래 사용 NCP 연동 시 수정 및 삭제
import image1 from "../assets/image/1_outer.jpg";
import image2 from "../assets/image/2_outer.jpg";
import image3 from "../assets/image/4_outer.jpg";
import image4 from "../assets/image/6_outer.jpg";


const Main_index = () => {
    const [animate, setAnimate] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);

    //확인하기 위해 아래 사용 NCP 연동 시 수정 및 삭제
    const slides = [
        { src: image1 },
        { src: image2 },
        { src: image3 },
        { src: image4 },
    ];

    const onStop = () => setAnimate(false);
    const onRun = () => setAnimate(true);

     const toggleMenu = () => {
          setMenuOpen(!menuOpen); // 메뉴 상태 토글
      };

    useEffect(() => {
        // AOS 초기화
        AOS.init({
            duration: 2000,   // 애니메이션 지속 시간
            once: false,      // 한번만 애니메이션 실행 여부
            offset: 0,        // 애니메이션 트리거 위치
        });
        AOS.refresh();
    }, []);

    const parentDivRef = useRef(null);
    const childDivRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const parentDiv = parentDivRef.current;
            const viewportHeight = window.innerHeight;
            const fromViewportToParentHeight = parentDiv.getBoundingClientRect().top;
            const scrollPassedAmount = viewportHeight - fromViewportToParentHeight;

            // Determine div height
            let divHeight = parentDiv.clientHeight > viewportHeight ? viewportHeight : parentDiv.clientHeight;
            let scrollRate = (scrollPassedAmount / divHeight) * 100;

            // Clamp scrollRate to [0, 100] range
            if (scrollRate < 0) {
                scrollRate = 0;
            } else if (scrollRate > 100) {
                scrollRate = 100;
            }

            // Apply style
            const childDiv = childDivRef.current;
            childDiv.style.transform = `scale(${scrollRate / 100})`;
        };

        // Attach scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <div className={styles.maindiv}>
            {/* banner */}
            <div className={styles.videoContainer}>
                <video className={styles.video} autoPlay muted loop>
                    <source src={video} type="video/mp4" />
                </video>
                {/* 메뉴바 */}
                <div
                    className={`${styles.menuBar} ${menuOpen ? styles.menuOpen : ''}`}
                    onClick={toggleMenu}
                >
                    <div className={styles.menuBarLine}></div>
                    <div className={styles.menuBarLine}></div>
                    <div className={styles.menuBarLine}></div>
                </div>

                {/* 토글 메뉴 */}
                <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`}>
                <ul className={styles.menuList}>
                    {isLoggedIn ? (
                    <>
                        <li>
                        <Link to="/mypage">MyPage</Link> {/* 로그인 상태: 마이페이지 */}
                        </li>
                        <li>
                        <a href="#" onClick={handleLogout}>Logout</a> {/* 로그아웃 */}
                        </li>
                    </>
                    ) : (
                    <li>
                        <Link to="/user">Login</Link> {/* 비로그인 상태: 로그인 */}
                    </li>
                    )}
                    <li>
                    <Link to="/product-list">STORE</Link>
                    </li>
                    <li>
                    <Link to="/qna_faqboard">QnA</Link>
                    </li>
                    <li>
                    <a href="#">토글메뉴 4번</a>
                    </li>
                </ul>
                </div>
            </div>

            {/* main_part1 */}
            <div className={styles.stickyContainer}>
                {/* 이미지 섹션 */}
                <div 
                    className={styles.imageSection} 
                    data-aos="fade-right" 
                    data-aos-offset="100%"  // 화면 중앙에서 트리거
                    data-aos-delay="500"   // 지연 시간 500ms
                ></div>

                {/* 구분선 */}
                <div 
                    className={styles.divider} 
                    data-aos="fade-right" 
                    data-aos-offset="100%"  // 화면 중앙에서 트리거
                    data-aos-delay="800"   // 지연 시간 800ms
                ></div>

                {/* 텍스트 섹션 */}
                <div 
                    className={styles.textSection} 
                    data-aos="fade-up" 
                    data-aos-offset="100%"  // 화면 중앙에서 트리거
                    data-aos-delay="1200"   // 지연 시간 1200ms
                >
                    <h1 className={styles.title}>Moivo</h1>
                    <p className={styles.text}>
                        Discover elegance redefined. Step into a world where style meets sophistication, crafted exclusively for those who dare to stand out.
                    </p>
                </div>
            </div>

           {/* main_part2 */}
            <div className={styles.stickyContainer2}>
                {/* 텍스트 섹션 */}
                <div 
                    className={styles.textSection2} 
                    data-aos="fade-up" 
                    data-aos-offset="100%"  // 화면 중앙에서 트리거
                    data-aos-delay="1200"   // 지연 시간 1200ms
                >
                    <h1 className={styles.title2}>Moivo</h1>
                    <p className={styles.text2}>
                        Embrace the essence of timeless elegance, where each detail is crafted to captivate. A realm of sophistication awaits, designed for those bold enough to make their mark.
                    </p>
                </div>
                {/* 구분선 */}
                <div 
                    className={styles.divider2} 
                    data-aos="fade-left" 
                    data-aos-offset="100%"  // 화면 중앙에서 트리거
                    data-aos-delay="800"   // 지연 시간 800ms
                ></div>
                {/* 이미지 섹션 */}
                <div 
                    className={styles.imageSection2} 
                    data-aos="fade-left" 
                    data-aos-offset="100%"  // 화면 중앙에서 트리거
                    data-aos-delay="500"   // 지연 시간 500ms
                ></div>
            </div>

            {/* main_part3 */}
            <div ref={parentDivRef} className={styles.stickyContainer3}>
                <div ref={childDivRef} className={styles.child_div2}>
                    <div 
                        className={styles.textSection3} 
                        data-aos="fade-up" 
                        data-aos-offset="100%"  
                        data-aos-delay="1200"   
                    ><h1 className={styles.title3}>Today’s weather, my mood</h1>
                    <p className={styles.text3}>
                        기온에 따라 변하는 나만의 룩, 
                        오늘의 무드에 맞는 스타일을 찾아보세요.
                    </p>
                    </div>
                </div>
            </div>

            {/* main_part4 */}
            <div className={styles.slide_container}>
                <ul
                    className={styles.slide_wrapper}
                    onMouseEnter={onStop}
                    onMouseLeave={onRun}
                >
                    {/* Original 슬라이드 */}
                    <div
                        className={`${styles.slide} ${styles.original} ${
                            !animate ? styles.stop : ""
                        }`}
                    >
                        {slides.map((s, i) => (
                            <Link to="/product">
                                <li key={i} className={styles.slide_list}>
                                    
                                        <img
                                            src={s.src}
                                            alt={`Slide ${i + 1}`}
                                            className={styles.item}
                                        />
                                    
                                </li>
                            </Link>
                        ))}
                    </div>
                    {/* Clone 슬라이드 */}
                    <div
                        className={`${styles.slide} ${styles.clone} ${
                            !animate ? styles.stop : ""
                        }`}
                    >
                        {slides.map((s, i) => (
                            <Link to="/product">
                                <li key={i} className={styles.slide_list}>
                                        <img
                                            src={s.src}
                                            alt={`Slide ${i + 1}`}
                                            className={styles.item}
                                        />
                                </li>
                            </Link>
                        ))}
                    </div>
                </ul>
                <div className={styles.main4Title}>
                    <p>Moivo 만의 감성과 편안함, <br/>
                        그리고 다양한 스타일을 사용자 맞춤으로 추천합니다.</p>
                </div>
            </div>
            {/* main_part4 end */}


            {/* main_part5 */}
            <div className={styles.book}>
                <section className={styles.pageSection}>
                    <div className={styles.page1}>
                    <h2>Moivo</h2>
                    <span>f/w 최대 90% Sale</span>
                    </div>
                    <Link to="/product">
                        <div className={styles.page2}>
                        <h2>Sale Product</h2>
                        <span>This is second page...</span>
                        </div>
                    </Link>
                </section>
            </div>


            {/* Footer */}
            <footer id="main-footer" className={styles.mainFooter}>
                <div className="container">
                    <div className={styles.footerGridContainer}>
                        <div>
                            <section className={styles.navLogo}>
                                Moivo
                            </section>
                            <p>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque provident labore suscipit, id illo magni odit?
                            </p>
                        </div>
                        <div>
                            <h2>PRIVACY & TERMS</h2>
                            <ul className={styles.anchorLinks}>
                                <li><a href="#">Privacy & Security</a></li>
                                <li><a href="#">Terms and Conditions</a></li>
                                <li><a href="#">Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h2>GET NOTIFIED FOR NEW PRODUCTS</h2>
                            <form>
                                <input type="email" placeholder="Email" />
                                <input type="submit" className={styles.btn} value="Submit" />
                            </form>
                        </div>
                        <div>
                            <h2>SITE LINKS</h2>
                            <ul className={styles.anchorLinks}>
                                <li><a href="#">About us</a></li>
                                <li><a href="#">Help & Support</a></li>
                                <li><a href="#">Career</a></li>
                                <li><a href="#">Refund Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        
    );
};

export default Main_index;