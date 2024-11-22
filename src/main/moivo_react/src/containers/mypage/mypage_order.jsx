import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../../assets/css/Mypage_order.module.css";
import Banner from "../../components/Banner/banner";
import Footer from "../../components/Footer/Footer";

const mypage_order = () => {
    const orders = [
        {
            orderDate: "2024-11-15",
            orderNumber: "20241115-0001256",
            items: [
                {
                    image: "/image/order1.png",
                    productName: "Ballerina skirt",
                    productOptions: "black M",
                    price: 69000, 
                    quantity: 2,
                },
                {
                    image: "/image/order2.png",
                    productName: "Golgi cotton bolero",
                    productOptions: "white",
                    price: 65000,
                    quantity: 1,
                },
            ],
            status: "구매확정",
        },
        {
            orderDate: "2024-09-05",
            orderNumber: "20240905-1560058",
            items: [
                {
                    image: "/image/order2.png",
                    productName: "Golgi cotton bolero",
                    productOptions: "white",
                    price: 65000,
                    quantity: 1,
                },
            ],
            status: "구매확정",
        },
        {
            orderDate: "2024-07-21",
            orderNumber: "20240721-420558",
            items: [
                {
                    image: "/image/order3.png",
                    productName: "Jewel tee",
                    productOptions: "pink S",
                    price: 39000,
                    quantity: 3,
                },
            ],
            status: "구매확정",
        },
    ];

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
                        <div className={styles.column2}>총 금액</div>
                        <div className={styles.column2}>주문처리상태</div>
                    </div>
                    {orders.map((order, index) => {
                        const mainItem = order.items[0]; // 대표 상품
                        const additionalCount = order.items.length - 1; // 추가 상품 개수
                        
                        // 총 금액 계산
                        const totalPrice = order.items.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                        );

                        return (
                            <div className={styles.row} key={index}>
                                <div className={styles.column}>
                                    {order.orderDate} <br />
                                    <Link to={'/mypage/orderDetails'} className={styles.orderLink}>
                                        [{order.orderNumber}]
                                    </Link>
                                </div>
                                <div className={styles.image}>
                                    <img src={mainItem.image} alt={mainItem.productName} />
                                </div>
                                <div className={styles.column}>
                                    {mainItem.productName} ({mainItem.quantity}개)
                                    {additionalCount > 0 && ` 외 ${additionalCount}개`}
                                    <br />
                                    [옵션: {mainItem.productOptions}]
                                </div>
                                <div className={styles.column}>
                                    KRW {totalPrice.toLocaleString()} {/* 총 금액 */}
                                </div>
                                <div className={styles.column}>
                                    {order.status}
                                    <button className={styles.reviewButton}>REVIEW</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default mypage_order;
