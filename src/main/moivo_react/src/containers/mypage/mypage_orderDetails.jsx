import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../../assets/css/Mypage_orderDetails.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const MypageOrderDetails = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
      navigate('/mypage/order'); // 이동할 경로 설정
    };

    // 주문 상품 데이터를 배열로 정의
    const orderItems = [
        {
            orderDate: "2024-11-15",
            orderNumber: "20241115-0001256",
            image: "../image/order1.png",
            productName: "Ballerina skirt",
            option: "black M",
            price: 69000,
            quantity: 2, // 수량 추가
            status: "구매확정",
        },
        {
            orderDate: "2024-11-15",
            orderNumber: "20241115-0001257",
            image: "../image/order2.png",
            productName: "Golgi cotton bolero",
            option: "white",
            price: 65000,
            quantity: 1,
            status: "배송중",
        },
        {
            orderDate: "2024-11-15",
            orderNumber: "20241115-0001258",
            image: "../image/order3.png",
            productName: "Jewel tee",
            option: "pink S",
            price: 39000,
            quantity: 3,
            status: "배송완료",
        },
    ];
    

    // 자동 계산 로직
    const discount = 10000; // 고정 할인 금액
    const shippingFee = 5000; // 고정 배송비
    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const finalPrice = totalPrice - discount + shippingFee;
    
    return (
        <div>
            <div className={styles.orderDetailsContainer}>
                <Banner/>
                {/* 헤더 섹션 */}
                <header className={styles.header}>
                    <h1>ORDER DETAILS</h1>
                </header>

                {/* 주문 및 배송 정보 */}
                <section className={styles.infoSection}>
                    <div className={styles.orderInfo}>
                        <p className={styles.label2} style={{ color: '#2F2E2C' }}>주문정보</p>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문번호:</p>
                            <p className={styles.value}>20241115-0001256</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문일자:</p>
                            <p className={styles.value}>2024-11-15 15:56:26</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문자:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>전수민</p>
                        </div>
                    </div>
                    <div className={styles.shippingInfo}>
                        <p className={styles.label2} style={{ color: '#2F2E2C' }}>배송지정보</p>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>우편번호:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>06134</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주소:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>서울시 강남구 강남대로94길 20 6층 602호</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>휴대전화:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>010 - 4567 - 0680</p>
                        </div>
                    </div>
                </section>
                <hr className={styles.solidLine} />

                
                {/* 주문 상품 정보 */}
                <section className={styles.tableSection}>
                    <div className={styles.table}>
                    <div className={styles.row}>
                        <div className={styles.column2}>주문일자<br />[주문번호]</div>
                        <div className={styles.column2}>이미지</div>
                        <div className={styles.column2}>상품정보</div>
                        <div className={styles.column2}>수량</div> {/* 수량 열 추가 */}
                        <div className={styles.column2}>상품금액</div>
                        <div className={styles.column2}>주문처리상태</div>
                    </div>
                    {orderItems.map((item, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.column}>
                                {item.orderDate} <br />
                                <Link to={`/mypage/order/`} className={styles.orderLink}>
                                    [{item.orderNumber}]
                                </Link>
                            </div>
                            <div className={styles.image}>
                                <img src={item.image} alt={`order-${index}`} />
                            </div>
                            <div className={styles.column}>
                                {item.productName} <br />[옵션: {item.option}]
                            </div>
                            <div className={styles.column}>{item.quantity}</div> {/* 수량 표시 */}
                            <div className={styles.column}>{(item.price * item.quantity).toLocaleString()}</div>
                            <div className={styles.column}>
                                {item.status}
                                {item.status === "구매확정" && (
                                    <button className={styles.reviewButton}>REVIEW</button>
                                )}
                            </div>
                        </div>

                        ))}
                    </div>
                </section>

                <hr className={styles.solidLine} />

                {/* 결제 정보 */}
                <section className={styles.paymentSummary}>
                    <div className={styles.paymentDetails}>
                        <p>상품구매금액: KRW {totalPrice.toLocaleString()}</p>
                        <p>- 할인금액: KRW {discount.toLocaleString()}</p>
                        <p>+ 배송비: KRW {shippingFee.toLocaleString()}</p>
                    </div>
                    <p className={styles.totalPrice}>합계: <span>KRW {finalPrice.toLocaleString()}</span></p>
                </section>


                {/* 주문 목록 버튼 */}
                <button className={styles.backToOrders} onClick={handleButtonClick}>
                    주문목록
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default MypageOrderDetails;