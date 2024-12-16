import React, { useState } from 'react';
import QnA_w from '../../assets/css/qna_board.module.css'; 
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import { PATH } from '../../../scripts/path';

const Qna_board = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "",
    title: "",
    question: "",
    isSecret: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "문의 유형을 선택하세요.";
    if (!formData.title) newErrors.title = "제목을 입력하세요.";
    if (!formData.question) newErrors.question = "문의 내용을 입력하세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 토큰 가져오기
    const userId = parseInt(localStorage.getItem("id")); // 로컬 스토리지에서 유저아이디 가져오기
  
    if (!token) {
      alert("로그인이 필요합니다."); // 토큰이 없으면 알림 표시
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
  
    // 요청 데이터 준비
    const postData = {
      categoryId: formData.type === "일반 문의" ? 1 :  
                  formData.type === "기타 문의" ? 2 :
                  formData.type === "비밀 문의" ? 3 :
                  formData.type === "사이즈 문의" ? 4 : 0,
      title: formData.title,
      content: formData.question,
      secret: formData.isSecret,
      userId: userId, // 로컬스토리지에서 가져온 userId
    };
  
    console.log("Submitted Data:", postData);
  
    // 서버로 데이터 전송
    fetch(`${PATH.SERVER}/api/user/question/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 토큰 추가
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("문의 작성에 실패했습니다.");
        }
        return response.json();
      })
      .then(() => {
        alert("문의가 성공적으로 작성되었습니다!");
        navigate("/qna_boardlist"); // 작성 후 문의 게시글 목록으로 이동
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("문의 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className={QnA_w.qnaboardMainDiv}>
      <div><Banner /></div>
      <div className={QnA_w.qnaboardheader}></div>

      <div className={QnA_w.qnaboardTitle}>고객센터</div>

      {/* 네비게이션 */}
      <div className={QnA_w.qnaboardNavi}>
        <Link to="/qna_faqboard">
          <button className={QnA_w.qnaboardNaviBtn}>자주 묻는 질문</button>
        </Link>
        <Link to="/qna_board">
          <button className={QnA_w.qnaboardNaviBtn}>문의 작성하기</button>
        </Link>
        <Link to="/qna_boardlist">
          <button className={QnA_w.qnaboardNaviBtn}>문의 게시글</button>
        </Link>
      </div>

      {/* 게시글 작성 폼 */}
      <div className={QnA_w.qnaboardContainer}>
        <div className={QnA_w.qnaboard}>
          <form onSubmit={handleSubmit} className={QnA_w.qnaboardItem}>
            <div className={QnA_w.qnaboardHeader}>
              <span className={QnA_w.qnaboardQuestionType}>문의 유형</span>
              <select className={QnA_w.qnaboardSelect} name="type" value={formData.type} onChange={handleChange} required >
                <option value="">문의 유형을 선택하세요</option>
                <option value="일반 문의">일반 문의</option>
                <option value="비밀 문의">비밀 문의</option>
                <option value="기타 문의">기타 문의</option>
                <option value="사이즈 문의">사이즈 문의</option>
              </select>
              {errors.type && <p className={QnA_w.errorMsg}>{errors.type}</p>}
            </div>

            <div className={QnA_w.qnaboardHeader}>
              <span className={QnA_w.qnaboardQuestionType}>제목</span>
              <input type="text" className={QnA_w.qnaboardInput} name="title" placeholder="제목을 입력하세요" value={formData.title} onChange={handleChange} required />
              {errors.title && <p className={QnA_w.errorMsg}>{errors.title}</p>}
            </div>

            {/* 비밀글 체크박스 */}
            <div className={QnA_w.qnaboardHeader} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="isSecret" style={{ fontWeight: 'bold', fontSize: '14px' }}>비밀글</label>
              <input type="checkbox" name="isSecret" id="isSecret" className={QnA_w.qnaboardCheckbox} checked={formData.isSecret} onChange={handleChange} />
            </div>

            <div className={QnA_w.qnaboardHeader}>
              <span className={QnA_w.qnaboardQuestionType}>내용</span>
              <textarea className={QnA_w.qnaboardTextarea} name="question" placeholder="문의 내용을 입력하세요" value={formData.question} onChange={handleChange} required />
              {errors.question && <p className={QnA_w.errorMsg}>{errors.question}</p>}
            </div>

            <div className={QnA_w.qnaboardSubmit}>
              <button type="submit" className={QnA_w.qnaboardSubmitBtn}>작성하기</button>
            </div>
          </form>
        </div> 
      </div>

      <Footer />
    </div>
  );
};

export default Qna_board;