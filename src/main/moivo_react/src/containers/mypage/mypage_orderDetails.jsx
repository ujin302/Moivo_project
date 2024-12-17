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
        const id = decodedPayload.id;  //토큰에 있는 id 추출
        console.log("User ID:", id);

        const paymentId = OrdersInfo[0]?.id; // paymentId를 설정할 시점
        console.log("paymentId :", paymentId);

        //구매한 payment info 정보 가지고 오기, 구매한 상세 목록 가지고 오기 - 12/17 강민
        const fetchData = async () => {
            try {
                const orderInfoResponse = await axiosInstance.get(`/api/user/mypage/orders/info/${tosscode}`);
                setOrdersInfo(orderInfoResponse.data);

                const orderDetailsResponse = await axiosInstance.get(`/api/user/mypage/orders/details/${paymentId}`);
                setOrderDetailList(orderDetailsResponse.data);

                // OrdersInfo가 로드된 후 paymentId 설정
                if (OrdersInfo[0]) {
                    setPaymentId(OrdersInfo[0].id); // OrdersInfo[0]가 있을 경우에만 설정
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();

      }, [navigate, tosscode, OrdersInfo]);

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
                            <p className={styles.value}>{OrdersInfo[0]?.paymentDate}</p>
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
                        <div className={styles.column2}>상품</div>
                        <div className={styles.column2}>상품정보</div>
                        <div className={styles.column2}>수량</div> {/* 수량 열 추가 */}
                        <div className={styles.column2}>상품금액</div>
                        <div className={styles.column2}>주문처리상태</div>
                    </div>
                    {OrderDetailList.map((item, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.image}>
                                <img src={item.productImg} alt={`order-${index}`} />
                            </div>
                            <div className={styles.column3}>
                                {item.productName} <br />[옵션: {item.size}]
                            </div>
                            <div className={styles.column}>{item.count}</div> {/* 수량 표시 */}
                            <div className={styles.column}>{(item.price * item.count).toLocaleString()}</div>
                            <div className={styles.column}>
                                {OrdersInfo[0]?.deliveryStatus}
                                {OrdersInfo[0]?.deliveryStatus === "구매확정" && (
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
                        <p>상품구매금액: KRW {OrdersInfo[0]?.totalPrice}</p>
                    </div>
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
