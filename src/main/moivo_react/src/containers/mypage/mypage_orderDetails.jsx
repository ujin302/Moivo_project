import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from "../../assets/css/Mypage_orderDetails.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";
import { PATH } from '../../../scripts/path';

const MypageOrderDetails = () => {
    const location = useLocation();
    const [OrderDetailList, setOrderDetailList] = useState([]);
    const [OrdersInfo, setOrdersInfo] = useState([]);
    const { tosscode } = location.state || {};
    const navigate = useNavigate();

    //주문 목록으로 다시 이동하는 부분
    const handleButtonClick = () => {
      navigate('/mypage/order'); // 이동할 경로 설정
    };


    //구매한 payment info 정보 가지고 오기 - 12/17 강민
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/user");
            return;
        }
    
        // 구매한 info 가져오기
        fetch(`${PATH.SERVER}/api/user/mypage/orders/info/${tosscode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("구매 정보를 가져오지 못했습니다.");
            }
            return response.json();
          })
          .then((data) => {
            setOrdersInfo(data); // 구매 목록 상태에 저장
          })
          .catch((error) => {
            console.error("Error fetching order list:", error);
            alert("구매 정보를 가져오는 중 오류가 발생했습니다.");
          });
    
      }, [navigate]);

    //*********************************************************************** */

    //구매한 상세 목록 가지고 오기 - 12/17 강민
    // useEffect(() => {
    //     const token = localStorage.getItem("accessToken");
        
    //     if (!token) {
    //         alert("로그인이 필요합니다.");
    //         navigate("/user");
    //         return;
    //     }
    
    //     // 구매 목록 가져오기
    //     fetch(`${PATH.SERVER}/api/user/mypage/orders/details/${tosscode}`, {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //       }
    //     })
    //     .then((response) => {
    //         if (!response.ok) {
    //             throw new Error("구매 상세 목록을 가져오지 못했습니다.");
    //         }
    //         return response.json();
    //       })
    //       .then((data) => {
    //         setOrderDetailList(data); // 구매 목록 상태에 저장
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching order list:", error);
    //         alert("구매 상세 목록을 가져오는 중 오류가 발생했습니다.");
    //       });
    
    //   }, [navigate]);

    // 다음과 같은 형태로 받아올 것
    // const orderItems = [
    //     {
    //         orderDate: "2024-11-15",     //주문 날짜
    //         orderNumber: "20241115-0001256",     //tosscode
    //         image: "../image/order1.png",    //image
    //         productName: "Ballerina skirt",  //상품 이름
    //         option: "black M",   //상품 사이즈
    //         price: 69000,    //상품 개별 가격
    //         quantity: 2,     // 수량
    //         status: "구매확정",  //주문 현황
    //     }
    // ];
    

    // 자동 계산 로직
    //const discount = 10000; // 고정 할인 금액
    //const shippingFee = 5000; // 고정 배송비
    //const totalPrice = OrdersInfo.reduce((total, item) => total + item.price * item.quantity, 0);
    //const finalPrice = totalPrice - discount;
    //const finalPrice = totalPrice;
    
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
                            <p className={styles.value}>{OrdersInfo.tosscode}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문일자:</p>
                            <p className={styles.value}>{OrdersInfo.paymentDate}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주문자:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo.name}</p>
                        </div>
                    </div>
                    <div className={styles.shippingInfo}>
                        <p className={styles.label2} style={{ color: '#2F2E2C' }}>배송지정보</p>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>우편번호:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo.zipcode}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>주소:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo.addr1} {OrdersInfo.addr2}</p>
                        </div>
                        <hr className={styles.dottedLine} />
                        <div className={styles.rowInfo}>
                            <p className={styles.label}>휴대전화:</p>
                            <p className={styles.value} style={{ color: '#2F2E2C' }}>{OrdersInfo.tel}</p>
                        </div>
                    </div>
                </section>
                <hr className={styles.solidLine} />

                
                {/* 주문 상품 정보 */}
                <section className={styles.tableSection}>
                    <div className={styles.table}>
                    <div className={styles.row}>
                        <div className={styles.column2}>주문일자</div>
                        <div className={styles.column2}>상품</div>
                        <div className={styles.column2}>상품정보</div>
                        <div className={styles.column2}>수량</div> {/* 수량 열 추가 */}
                        <div className={styles.column2}>상품금액</div>
                        <div className={styles.column2}>주문처리상태</div>
                    </div>
                    {OrderDetailList.map((detail, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.column}>
                                {detail.orderDate} <br />
                            </div>
                            <div className={styles.image}>
                                <img src={detail.image} alt={`order-${index}`} />
                            </div>
                            <div className={styles.column3}>
                                {detail.productName} <br />[옵션: {detail.option}]
                            </div>
                            <div className={styles.column}>{detail.quantity}</div> {/* 수량 표시 */}
                            <div className={styles.column}>{(detail.price * detail.quantity).toLocaleString()}</div>
                            <div className={styles.column}>
                                {detail.status}
                                {detail.status === "구매확정" && (
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
                        <p>상품구매금액: KRW {OrdersInfo.totalPrice}</p>
                    </div>
                    <p className={styles.totalPrice}>합계: <span>KRW {OrdersInfo.totalPrice}</span></p>
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