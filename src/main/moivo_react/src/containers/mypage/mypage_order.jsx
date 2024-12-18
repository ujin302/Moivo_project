import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../../assets/css/Mypage_order.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from '../../../scripts/path';
import axiosInstance from '../../utils/axiosConfig';

const Mypage_order = () => {
    const [OrdersList, setOrdersList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(OrdersList);
    }, [OrdersList]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user");
            return;
        }
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        const id = decodedPayload.id; 

        const fetchOrders = async () => {
            try {
                const ordersResponse = await axiosInstance.get(`/api/user/mypage/orders/${id}`);

                // 응답 데이터 유효성 검증
                if (!Array.isArray(ordersResponse.data)) {
                    console.warn("Unexpected response data format:", ordersResponse.data);
                    setOrdersList([]);
                    return;
                }

                setOrdersList(ordersResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);

                // 에러 상황 처리
                if (error.response) {
                    // 서버 응답에 상태 코드가 있는 경우
                    console.error("Server response error:", error.response.status, error.response.data);
                    alert("구매목록이 없습니다.");
                } else if (error.request) {
                    // 요청이 전송되었으나 응답이 없는 경우
                    console.error("No response received from server:", error.request);
                    alert("서버에서 응답이 없습니다. 네트워크 상태를 확인해주세요.");
                } else {
                    // 기타 에러
                    console.error("Error setting up request:", error.message);
                    alert("알 수 없는 에러가 발생했습니다.");
                }

                // 기본 데이터로 설정
                setOrdersList([]);
            }
        }

        fetchOrders();
      }, [navigate]);

    return (
        <div>
            <div className={styles.memberFrame}>
                <Banner />
                <div className={styles.order}>ORDER</div>
                <div className={styles.instructions}>
                    주문번호를 클릭하시면 해당 주문에 대한 상세내역을 확인하실 수 있습니다.<br />
                    취소/교환/반품 신청은 배송완료일 기준 7일까지 가능합니다.
                </div>
                <div className={styles.table}>
                    <div className={styles.row}>
                        <div className={styles.column2}>주문일자<br />[주문번호]</div>
                        <div className={styles.column2}>이미지</div>
                        <div className={styles.column2}>상품정보</div>
                        <div className={styles.column2}>총 수량</div>
                        <div className={styles.column2}>총 금액</div>
                        <div className={styles.column2}>주문처리상태</div>
                    </div>
                    {OrdersList.map((order, index) => {
                        const additionalCount = order.count - 1; // 추가 상품 개수
                        
                        // 총 금액 계산
                        const totalPrice = order.totalPrice;

                        // 총 수량 계산
                        const totalQuantity = order.count;

                        return (
                            <div className={styles.row} key={index}>
                                <div className={styles.column}>
                                    <Link to={'/mypage/orderDetails'} state={{ tosscode: order.tosscode }} className={styles.orderLink}>
                                        [{order.tosscode}]
                                    </Link>
                                </div>
                                <div className={styles.image}>
                                    {order?.productImg ? (
                                        <img src={order.productImg} alt={order.productName || "상품 이미지"} />
                                    ) : (
                                        <div>이미지가 없습니다</div>
                                    )}
                                </div>
                                <div className={styles.column3}>
                                    <div className={styles.productInfo}>
                                        <div className={styles.productName}>{order?.productName || "상품 정보 없음"}</div>
                                        {order.count > 1 && ` 외 ${order.count - 1}개`}
                                        <br />
                                    </div>
                                </div>
                                <div className={styles.column}>
                                    {totalQuantity}개
                                </div>
                                <div className={styles.column}>
                                    KRW {totalPrice.toLocaleString()}
                                </div>
                                <div className={styles.column}>
                                    {order.deliveryStatus === "CONFIRMED" ? (
                                        <div className={styles.confirmedText}>배송완료</div>
                                    ) : order.deliveryStatus === "PAYMENT_COMPLETED" ? (
                                        <div className={styles.statusText}>결제완료</div>
                                    ) : order.deliveryStatus === "READY" ? (
                                        <div className={styles.statusText}>준비중</div>
                                    ) : order.deliveryStatus === "DELIVERY" ? (
                                        <div className={styles.statusText}>배송중</div>
                                    ) : (
                                        order.deliveryStatus || "배송 상태 없음"
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.bottomBar}></div>
                <Link to="/mypage" className={styles.backLink}>
                    Go Back to MyPage
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default Mypage_order;
