import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import admin_dashboard from '../../assets/css/admins_dashboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from "react-router-dom";

const Admins_dashboard = () => {  // 24.12.13 백, 프론트 연결 - yjy
  const { isAdmin, getAccessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
  const [selectedProductStatus, setSelectedProductStatus] = useState(null);
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

  const handleCardClick = (statusType) => {
    setSelectedProductStatus(statusType);
  };
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const paymentRes = await axiosInstance.get('/api/admin/payment');
        setPaymentStatus(paymentRes.data);

        const deliveryRes = await axiosInstance.get('/api/admin/payment/delivery');
        setDeliveryStatus(deliveryRes.data);

        const productRes = await axiosInstance.get('/api/admin/store/product/status');
        setProductStatus(productRes.data);

        const questionRes = await axiosInstance.get('/api/admin/qna/management/questions/status');
        setQuestionStatus(questionRes.data);

        const userRes = await axiosInstance.get('/api/admin/users/states');
        const gradeRes = await axiosInstance.get('/api/admin/users/states/grade');
        
        setUserStatus(prev => ({
          totalUsers: userRes.data.totalUsers,
          gradeStats: gradeRes.data
        }));

      } catch (error) {
        console.error('대시보드 데이터 로딩 실패:', error);
        if (error.response?.status === 401) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            fetchDashboardData();
          } else {
            navigate('/user');
          }
        }
      }
    };

    if (isAdmin) {
      fetchDashboardData();
    } else {
      navigate('/login');
    }
  }, [isAdmin, navigate, refreshAccessToken]);

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
                <div 
                  className={admin_dashboard.cardItem} 
                  onClick={() => handleCardClick('판매 상품')}
                >
                  <Link to="/admin/admin_productList">
                    판매 상품 :
                  </Link>
                  <span className={admin_dashboard.cardNumber}>{productStatus['판매 상품']}</span>
                </div>
                <div className={admin_dashboard.cardItem} onClick={() => handleCardClick('품절 상품')}>
                  <Link to="/admin/admin_productList?status=SOLDOUT">
                    품절 상품 :
                  </Link>
                  <span className={admin_dashboard.cardNumber}>{productStatus['품절 상품']}</span>
                </div>

                <div className={admin_dashboard.cardItem} onClick={() => handleCardClick('삭제된 상품')}>
                  <Link to="/admin/admin_productList?status=DELETED">
                    삭제된 상품 :
                  </Link>
                  <span className={admin_dashboard.cardNumber}>{productStatus['삭제된 상품']}</span>
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
                <Link 
                  to="/admins_qnaboard?filter=ALL" 
                  className={`${admin_dashboard.cardItem} ${admin_dashboard.clickable}`}
                >
                  전체 문의 :
                  <span className={admin_dashboard.cardNumber}>{questionStatus.totalQuestions}</span>
                </Link>
                <Link 
                  to="/admins_qnaboard?filter=WAITING" 
                  className={`${admin_dashboard.cardItem} ${admin_dashboard.clickable}`}
                >
                  미 답변 :
                  <span className={admin_dashboard.cardNumber}>{questionStatus.unansweredQuestions}</span>
                </Link>
                <Link 
                  to="/admins_qnaboard?filter=ANSWERED" 
                  className={`${admin_dashboard.cardItem} ${admin_dashboard.clickable}`}
                >
                  답변 완료 :
                  <span className={admin_dashboard.cardNumber}>{questionStatus.answeredQuestions}</span>
                </Link>
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
