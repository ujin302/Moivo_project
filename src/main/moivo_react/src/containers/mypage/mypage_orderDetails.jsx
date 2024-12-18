import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from "../../assets/css/Mypage_orderDetails.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from '../../../scripts/path';
import axiosInstance from '../../utils/axiosConfig';

const MypageOrderDetails = () => {
    const location = useLocation();
    const [OrderDetailList, setOrderDetailList] = useState([]);
    const [OrdersInfo, setOrdersInfo] = useState({});
    const [paymentId, setPaymentId] = useState(undefined);
    const { tosscode } = location.state || {};
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    //주문 목록으로 다시 이동하는 부분
    const handleButtonClick = () => {
      navigate('/mypage/order'); // 이동할 경로 설정
    };

    //디테일 가지고 오기 - 12/17 강민
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user");
            return;
        }

        // 토큰 디코딩 (jwt-decode 없이)
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        setUserId(decodedPayload.id);
        console.log("User ID:", decodedPayload.id);

        //구매한 payment info 정보 가지고 오기, 구매한 상세 목록 가지고 오기 - 12/17 강민
        const fetchOrdersInfo = async () => {
            try {
                const orderInfoResponse = await axiosInstance.get(`/api/user/mypage/orders/info/${tosscode}`);
                setOrdersInfo(orderInfoResponse.data);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchOrdersInfo();

      }, [navigate, tosscode]);

      useEffect(() => {
        if (OrdersInfo.length > 0) {
            const paymentId = OrdersInfo[0]?.id;
            console.log("paymentId :", paymentId);
    
            // 2단계: OrderDetailList 가져오기
            const fetchOrderDetails = async () => {
                try {
                    const orderDetailsResponse = await axiosInstance.get(`/api/user/mypage/orders/details/${paymentId}`);
                    setOrderDetailList(orderDetailsResponse.data);

                    // OrdersInfo가 로드된 후 paymentId 설정
                    if (OrdersInfo[0]) {
                        setPaymentId(OrdersInfo[0].id); // OrdersInfo[0]가 있을 경우에만 설정
                    }
                } catch (error) {
                    console.error("Error fetching order details:", error);
                }
            };
    
            fetchOrderDetails();
        }
    }, [OrdersInfo]);

      //값 확인하기
      useEffect(() => {
        console.log("Updated OrdersInfo:", OrdersInfo);
        console.log("OrdersInfo as JSON:", JSON.stringify(OrdersInfo, null, 2)); // JSON 형태로 보기
      }, [OrdersInfo]);

      useEffect(() => {
        console.log("OrderDetailList:", OrderDetailList);
      }, [OrderDetailList]);

    //*********************************************************************** */
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
                            <p className={styles.value}>{OrdersInfo[0]?.tosscode}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문일자:</p>
                            <p className={styles.value}>{OrdersInfo[0]?.paymentDate?.replace('T', ' ')}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문자:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo[0]?.name}</p>
                        </div>
                    </div>
                    <div className={styles.shippingInfo}>
                        <p className={styles.label2} style={{ color: '#2F2E2C' }}>배송지정보</p>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>우편번호:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo[0]?.zipcode}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주소:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo[0]?.addr1} {OrdersInfo[0]?.addr2}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>휴대전화:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo[0]?.tel}</p>
                        </div>
                    </div>
                </section>
                <hr className={styles.solidLine} />

                
                {/* 주문 상품 정보 */}
                <section className={styles.tableSection}>
                    <div className={styles.table}>
                    <div className={styles.row}>
                        <div className={styles.column2}>상품이미지</div>
                        <div className={styles.column2}>상품명</div>
                        <div className={styles.column2}>사이즈</div>
                        <div className={styles.column2}>수량</div>
                        <div className={styles.column2}>상품금액</div>
                        <div className={styles.column2}>주문상태</div>
                    </div>
                    {OrderDetailList.map((item, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.image}>
                                <img src={item.productImg} alt={`order-${index}`} />
                            </div>
                            <div className={styles.column3}>{item.productName}</div>
                            <div className={styles.column}>{item.size}</div>
                            <div className={styles.column}>x {item.count}</div> {/* 수량 표시 */}
                            <div className={styles.column}>KRW {item.price}</div>
                            <div className={styles.column}>
                            {OrdersInfo[0]?.deliveryStatus === "CONFIRMED" ? (
                                item.writeReview === false ? (
                                    <>
                                        <div className={styles.confirmedText}>배송완료</div>
                                        <button 
                                            className={styles.reviewButton} 
                                            onClick={() => navigate('/review/write', { 
                                                state: { 
                                                    productId: item.productId,
                                                    productName: item.productName,
                                                    paymentDetailId: item.id,
                                                    size: item.size,
                                                    userId: userId,
                                                    userName: OrdersInfo[0]?.name,
                                                    orderDate: OrdersInfo[0]?.paymentDate
                                                } 
                                            })}
                                        >
                                            Review
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.reviewCompleteText}>리뷰작성완료</div>
                                        <button 
                                            className={styles.editReviewButton}
                                            onClick={() => navigate('/review/write', { 
                                                state: { 
                                                    productId: item.productId,
                                                    productName: item.productName,
                                                    paymentDetailId: item.id,
                                                    size: item.size,
                                                    userId: userId,
                                                    userName: OrdersInfo[0]?.name,
                                                    orderDate: OrdersInfo[0]?.paymentDate,
                                                    isEdit: true
                                                } 
                                            })}
                                        >
                                            리뷰 수정
                                        </button>
                                    </>
                                )
                            ) : OrdersInfo[0]?.deliveryStatus === "PAYMENT_COMPLETED" ? (
                                <div className={styles.statusText}>결제완료</div>
                            ) : OrdersInfo[0]?.deliveryStatus === "READY" ? (
                                <div className={styles.statusText}>준비중</div>
                            ) : OrdersInfo[0]?.deliveryStatus === "DELIVERY" ? (
                                <div className={styles.statusText}>배송중</div>
                            ) : (
                                OrdersInfo[0]?.deliveryStatus || "배송 상태 없음"
                            )}
                            </div>
                        </div>

                        ))}
                    </div>
                </section>

                <hr className={styles.solidLine} />

                {/* 결제 정보 */}
                <section className={styles.paymentSummary}>
                    <p className={styles.totalPrice}>합계: <span>KRW {OrdersInfo[0]?.totalPrice}</span></p>
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