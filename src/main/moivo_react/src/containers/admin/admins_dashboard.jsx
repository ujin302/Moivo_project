import React, { useState, useEffect } from 'react';
import admin_dashboard from '../../assets/css/admins_dashboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';

const admins_dashboard = () => {
  // 더미 데이터
  const statusData = {
    paymentCompleted: 1500,
    todaysPayment: 500,
    totalPayment: 2000,
    shippingPreparation: 5,
    shipping: 8,
    shipped: 10,
    soldProducts: 50,
    outOfStockProducts: 10,
    stockBelow10: 3,
    allInquiries: 20,
    unanswered: 5,
    totalUsers: 200,
    withdrawnUsers: 50,
    canceledOrders: 15,
    returnedOrders: 8
  };

  return (
    <div className={admin_dashboard.container}>
      {/* Sidebar 영역 */}
      <div className={admin_dashboard.sidebar}>
        <Admins_side />
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className={admin_dashboard.mainContent}>
        {/* 1번 섹션 */}
        <section className={admin_dashboard.section1}>
          <div className={admin_dashboard.cardContainer}>
            {/* 판매 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>판매 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.paymentCompleted}</span>
                  결제 완료
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.todaysPayment}</span>
                  상품 준비
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.totalPayment}</span>
                  배송 완료
                </div>
              </div>
            </div>

            {/* 처리 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>처리 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  배송 준비 :
                  <span className={admin_dashboard.cardNumber}>{statusData.shippingPreparation}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  배송 중 :
                  <span className={admin_dashboard.cardNumber}>{statusData.shipping}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  배송 완료 :
                  <span className={admin_dashboard.cardNumber}>{statusData.shipped}</span>
                </div>
              </div>
            </div>

            {/* 상품 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>상품 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  판매 상품 :
                  <span className={admin_dashboard.cardNumber}>{statusData.soldProducts}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  품절 상품 :
                  <span className={admin_dashboard.cardNumber}>{statusData.outOfStockProducts}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  재고 10 이하 :
                  <span className={admin_dashboard.cardNumber}>{statusData.stockBelow10}</span>
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
                  <span className={admin_dashboard.cardNumber}>{statusData.allInquiries}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  미 답변 :
                  <span className={admin_dashboard.cardNumber}>{statusData.unanswered}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  답변 완료 :
                  <span className={admin_dashboard.cardNumber}>{statusData.unanswered}</span>
                </div>
              </div>
            </div>

            {/* 유저 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>유저 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  총 유저수 :
                  <span className={admin_dashboard.cardNumber}>{statusData.totalUsers}</span>
                </div>
                <div className={admin_dashboard.cardItem}>
                  탈퇴수 :
                  <span className={admin_dashboard.cardNumber}>{statusData.withdrawnUsers}</span>
                </div>
              </div>
            </div>
            
            {/* 최소/반품 */}
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default admins_dashboard;
