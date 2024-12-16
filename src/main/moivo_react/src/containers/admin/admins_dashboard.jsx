import React, { useState, useEffect } from 'react';
import axios from 'axios';
import admin_dashboard from '../../assets/css/admins_dashboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';

const Admins_dashboard = () => {   // 24.12.13 백, 프론트 연결 - yjy
  const [paymentStatus, setPaymentStatus] = useState({});
  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [productStatus, setProductStatus] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [userStatus, setUserStatus] = useState({
    totalUsers: 0,
    gradeStats: {
      LV1: 0,
      LV2: 0,
      LV3: 0,
      LV4: 0,
      LV5: 0
    }
  });

  useEffect(() => {
    // 판매 현황
    axios.get('/api/admin/payment')
      .then(res => setPaymentStatus(res.data))
      .catch(err => console.error('판매 현황 조회 실패:', err));

    // 처리 현황
    axios.get('/api/admin/payment/delivery')
      .then(res => setDeliveryStatus(res.data))
      .catch(err => console.error('처리 현황 조회 실패:', err));

    // 상품 현황
    axios.get('/api/admin/store/product/status')
      .then(res => setProductStatus(res.data))
      .catch(err => console.error('상품 현황 조회 실패:', err));

    // 문의 현황
    axios.get('/api/admin/qna/management/questions/status')
      .then(res => setQuestionStatus(res.data))
      .catch(err => console.error('문의 현황 조회 실패:', err));

    // 회원 현황
    axios.get('/api/admin/users/states')
      .then(res => {
        setUserStatus(prev => ({
          ...prev,
          totalUsers: res.data.totalUsers
        }));
      })
      .catch(err => console.error('회원 현황 조회 실패:', err));

    // 등급별 회원 수
    axios.get('/api/admin/users/states/grade')
      .then(res => {
        setUserStatus(prev => ({
          ...prev,
          gradeStats: res.data
        }));
      })
      .catch(err => console.error('등급별 회원 수 조회 실패:', err));
  }, []);

  return (
    <div className={admin_dashboard.container}>
      {/* Sidebar 영역 */}
      <div className={admin_dashboard.sidebar}>
        <Admins_side />
      </div>

      <div className={admin_dashboard.mainContent}>
        {/* 1번 섹션 - 판매 현황 */}
        <section className={admin_dashboard.section1}>
          <div className={admin_dashboard.cardContainer}>
            {/* 판매 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>판매 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{paymentStatus.completedCount}</span>
                  결제 완료
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>
                    {paymentStatus.todayPrice?.toLocaleString()}
                  </span>
                  오늘 매출
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>
                    {paymentStatus.totalPrice?.toLocaleString()}
                  </span>
                  총 매출
                </div>
              </div>
            </div>

            {/* 처리 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>처리 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  배송 준비 :
                  <span className={admin_dashboard.cardNumber}>{deliveryStatus.readyDelivery}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  배송 중 :
                  <span className={admin_dashboard.cardNumber}>{deliveryStatus.delivering}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  배송 완료 :
                  <span className={admin_dashboard.cardNumber}>{deliveryStatus.delivered}</span>
                </div>
              </div>
            </div>

            {/* 상품 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>상품 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  판매 상품 :
                  <span className={admin_dashboard.cardNumber}>{productStatus['판매 상품']}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  품절 상품 :
                  <span className={admin_dashboard.cardNumber}>{productStatus['품절 상품']}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  재고 10 이하 :
                  <span className={admin_dashboard.cardNumber}>{productStatus['재고 10 이하']}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2번 섹션 */}
        <section className={admin_dashboard.section2}>
          <div className={admin_dashboard.cardContainer}>
            {/* 문의 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>문의 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  전체 문의 :
                  <span className={admin_dashboard.cardNumber}>{questionStatus.totalQuestions}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  미 답변 :
                  <span className={admin_dashboard.cardNumber}>{questionStatus.unansweredQuestions}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  답변 완료 :
                  <span className={admin_dashboard.cardNumber}>{questionStatus.answeredQuestions}</span>
                </div>
              </div>
            </div>

            {/* 유저 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>유저 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  총 회원수 :
                  <span className={admin_dashboard.cardNumber}>{userStatus.totalUsers}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  LV.1 :
                  <span className={admin_dashboard.cardNumber}>
                    {userStatus?.gradeStats?.LV1 || 0}
                  </span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  LV.2 :
                  <span className={admin_dashboard.cardNumber}>{userStatus.gradeStats.LV2 || 0}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  LV.3 :
                  <span className={admin_dashboard.cardNumber}>{userStatus.gradeStats.LV3 || 0}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  LV.4 :
                  <span className={admin_dashboard.cardNumber}>{userStatus.gradeStats.LV4 || 0}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  LV.5 :
                  <span className={admin_dashboard.cardNumber}>{userStatus.gradeStats.LV5 || 0}</span>
                </div>
              </div>
            </div>
            
            {/* 최소/반품 
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>최소/반품</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  총 유저수 :
                  <span className={admin_dashboard.cardNumber}>{statusData.canceledOrders}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  탈퇴수 :
                  <span className={admin_dashboard.cardNumber}>{statusData.returnedOrders}</span>
                </div>
              </div>
            </div>  */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admins_dashboard;
