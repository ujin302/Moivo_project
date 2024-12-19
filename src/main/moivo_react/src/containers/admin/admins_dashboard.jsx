import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import admin_dashboard from '../../assets/css/admins_dashboard.module.css';
import Admins_side from '../../components/admin_sidebar/admins_side';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
//
const Admins_dashboard = () => {  // 24.12.13 백, 프론트 연결 - yjy , 12/19 프론트 작성 - km
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);
  const salesCanvasRef = useRef(null);
  const { isAdmin, getAccessToken, refreshAccessToken } = useAuth();
  const navigate = useNavigate();
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
    }
  }, [isAdmin, navigate, refreshAccessToken]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {

      const ctx = canvas.getContext('2d');

      const data = [
        userStatus?.gradeStats?.LV1 || 0,
        userStatus?.gradeStats?.LV2 || 0,
        userStatus?.gradeStats?.LV3 || 0,
        userStatus?.gradeStats?.LV4 || 0,
        userStatus?.gradeStats?.LV5 || 0
      ]; // 데이터 값
      const labels = ['LV1', 'LV2', 'LV3', 'LV4', 'LV5']; // 라벨 값
      const colors = ['#225577', '#e56e24', '#ffbcc5', '#bcddb3', '#1150af'];
      const barWidth = 40;
      const gap = 20;
      const maxHeight = Math.max(...data);

      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      data.forEach((value, index) => {
        const x = index * (barWidth + gap) + gap;
        const y = canvas.height - (value / maxHeight) * canvas.height;
        const height = (value / maxHeight) * canvas.height;

        // 막대 그리기
        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, barWidth, height);

        // 라벨 추가
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, canvas.height - 5);
      });
    }
  }, [canvasRef,userStatus]);

  useEffect(() => {
    const canvas = salesCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const data = [100, 150, 200, 300, 250, 300, 400, 500, 450, 350, 300, 250];
      const maxHeight = Math.max(...data);
      const pointGap = canvas.width / (data.length - 1);

      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 선 그리기
      ctx.beginPath();
      ctx.strokeStyle = '#007BFF';
      ctx.lineWidth = 2;

      data.forEach((value, index) => {
        const x = index * pointGap;
        const y = canvas.height - (value / maxHeight) * canvas.height;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // 점과 라벨 추가
      data.forEach((value, index) => {
        const x = index * pointGap;
        const y = canvas.height - (value / maxHeight) * canvas.height;

        // 점 그리기
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#007BFF';
        ctx.fill();

        // 라벨 추가
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x, canvas.height - 5);
      });
    }
      setIsLoading(false);
    }, [salesCanvasRef]);
    
  
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
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <canvas className={admin_dashboard.canvas2} ref={salesCanvasRef} width={400} height={300} style={{ marginTop: '20px' }} />
                </>
              )}
              {/* <div className={admin_dashboard.cardList}>
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
              </div> */}
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
              <div className={admin_dashboard.chart_container}>
                {isLoading ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    <canvas className={admin_dashboard.canvas} ref={canvasRef} width={400} height={300} />
                  </>
                )}
                <div>
                  <p>총 회원수 : <span className={admin_dashboard.cardNumber}>{userStatus.totalUsers}</span></p>
                  <p>LV 1 : <span className={admin_dashboard.cardNumber}>{userStatus?.gradeStats?.LV1 || 0} 명</span></p>
                  <p>LV 2 : <span className={admin_dashboard.cardNumber}>{userStatus?.gradeStats?.LV2 || 0} 명</span></p>
                  <p>LV 3 : <span className={admin_dashboard.cardNumber}>{userStatus?.gradeStats?.LV3 || 0} 명</span></p>
                  <p>LV 4 : <span className={admin_dashboard.cardNumber}>{userStatus?.gradeStats?.LV4 || 0} 명</span></p>
                  <p>LV 5 : <span className={admin_dashboard.cardNumber}>{userStatus?.gradeStats?.LV5 || 0} 명</span></p>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admins_dashboard;
