import React, { useState, useEffect } from 'react';
import admin_dashboard from '../../assets/css/admins_dashboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';

// 예시 데이터
const statusData = {
  판매현황: {
    결제완료: 5,
    상품준비: 2,
    배송준비: 3,
    배송중: 2,
    배송완료: 1,
  },
  처리지연현황: {
    발송지연: 2,
    취소지연: 1,
    반품지연: 2,
    답변지연: 3,
  },
  취소반품현황: {
    취소주문: 4,
    반품주문: 3,
  },
  상품현황: {
    판매중상품: 10,
    품절상품: 3,
    재고10이하상품: 5,
  },
};

const admins_dashboard = () => {
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
                  <span className={admin_dashboard.cardNumber}>{statusData.판매현황.결제완료}</span>
                  결제 완료
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.판매현황.상품준비}</span>
                  상품 준비
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.판매현황.배송준비}</span>
                  배송 준비
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.판매현황.배송중}</span>
                  배송 중
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.판매현황.배송완료}</span>
                  배송 완료
                </div>
              </div>
            </div>

            {/* 처리 지연 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>처리 지연 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.처리지연현황.발송지연}</span>
                  발송 지연
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.처리지연현황.취소지연}</span>
                  취소 지연
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.처리지연현황.반품지연}</span>
                  반품 지연
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.처리지연현황.답변지연}</span>
                  답변 지연
                </div>
              </div>
            </div>

            {/* 취소/반품 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>취소/반품 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.취소반품현황.취소주문}</span>
                  취소 주문
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.취소반품현황.반품주문}</span>
                  반품 주문
                </div>
              </div>
            </div>

            {/* 상품 현황 */}
            <div className={admin_dashboard.card}>
              <h3 className={admin_dashboard.cardTitle}>상품 현황</h3>
              <div className={admin_dashboard.cardList}>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.상품현황.판매중상품}</span>
                  판매 중 상품
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.상품현황.품절상품}</span>
                  품절 상품
                </div>
                <div className={admin_dashboard.cardItem}>
                  <span className={admin_dashboard.cardNumber}>{statusData.상품현황.재고10이하상품}</span>
                  재고 10이하
                </div>
              </div>
            </div>
          </div>
        </section>
         {/* 2번 섹션 */}
         <section className={admin_dashboard.section2}>

         </section>
      </div>
    </div>
  );
};

export default admins_dashboard;
