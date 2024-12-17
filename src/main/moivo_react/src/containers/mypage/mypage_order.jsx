import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../../assets/css/Mypage_order.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from '../../../scripts/path';

const mypage_order = () => {
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
    
        // 구매 목록 가져오기
        fetch(`${PATH.SERVER}/api/user/mypage/orders/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("구매 목록을 가져오지 못했습니다.");
            }
            return response.json();
          })
          .then((data) => {
            setOrdersList(data); // 구매 목록 상태에 저장   
          })
          .catch((error) => {
            console.error("Error fetching order list:", error);
            alert("구매 목록을 가져오는 중 오류가 발생했습니다.");
          });
    
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
                                    <Link to={'/mypage/orderDetails'} className={styles.orderLink}>
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
                                    {order.deliveryStatus || "배송 상태 없음"}
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

export default mypage_order;
