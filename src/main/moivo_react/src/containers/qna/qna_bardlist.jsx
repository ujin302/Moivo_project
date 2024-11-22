import React, { useState } from 'react';
import QnA_b from '../../assets/css/qna_boardlist.module.css';
import { Link } from 'react-router-dom';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';

const qna_boardlist = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [currentUser, setCurrentUser] = useState('user123'); // 현재 로그인된 사용자 ID (예: user123)

    // qnaData를 컴포넌트 내에서 정의
    const qnaData = [
        {
            type: '일반 문의',
            title: '제품 배송 언제 되나요?',
            secret: false,
            userId: 'user123',
            date: '2024-11-21',
            question: '안녕하세요, 제품 배송 상태를 알고 싶습니다.',
            answer: '안녕하세요, 배송은 내일 출발 예정입니다.'
        },
        {
            type: '비밀 문의',
            title: '개인 정보 관련 문의',
            secret: true,
            userId: 'user456',
            date: '2024-11-20',
            question: '개인 정보 보호 정책에 대해 알고 싶습니다.',
            answer: '비밀문의입니다.'
        },
        {
            type: '기타 문의',
            title: '결제 방법 변경은 어떻게 하나요?',
            secret: false,
            userId: 'user789',
            date: '2024-11-19',
            question: '결제 방법을 변경하고 싶습니다.',
            answer: '결제 방법 변경은 고객센터를 통해 가능합니다.'
        },
        {
            type: '기타 문의',
            title: '결제 방법 변경은 어떻게 하나요?',
            secret: false,
            userId: 'user789',
            date: '2024-11-19',
            question: '결제 방법을 변경하고 싶습니다.',
            answer: null // 답변이 아직 없는 상태
        }
    ];

    const handleToggle = (index, isSecret) => {
        if (isSecret) {
            alert('비밀 문의입니다.');
            return;
        }
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className={QnA_b.qnalistMainDiv}>
            <div><Banner /></div>
            <div className={QnA_b.qnalistheader}></div>

            <div className={QnA_b.qnalistTitle}>고객센터</div>

                {/* 네비게이션 */}
                <div className={QnA_b.qnalistNavi}>
                    <Link to="/qna_faqboard">
                        <button className={QnA_b.qnalistNaviBtn}>자주 묻는 질문</button>
                    </Link>

                    <Link to="/qna_board">
                        <button className={QnA_b.qnalistNaviBtn}>문의 작성하기</button>
                    </Link>

                    <Link to="/qna_boardlist">
                        <button className={QnA_b.qnalistNaviBtn}>문의 게시글</button>
                    </Link>
                </div>

                {/* QnA 리스트 */}
                <div className={QnA_b.qnalist}>
                <div className={QnA_b.qnalistContainer}>
                    <div className={QnA_b.qnalist}>
                        {qnaData.length === 0 ? ( <div>등록된 문의가 없습니다.</div> ) : (
                            qnaData.map((item, index) => (
                                <div key={index} className={QnA_b.qnalistItem}>
                                    <div className={QnA_b.qnalistHeader} onClick={() => handleToggle(index, item.secret)}>
                                        <span className={QnA_b.qnalistQuestionType}>{item.type}</span>
                                        <span className={QnA_b.qnalistQuestionTitle}>
                                            {item.secret ? '비밀 문의' : item.title}
                                        </span>
                                        {item.secret && <span className={QnA_b.qnalistSecretLabel}>비밀 문의입니다.</span>}
                                    </div>
                                    {activeIndex === index && (
                                        <div className={QnA_b.qnalistDetails}>
                                            <div className={QnA_b.qnalistUserInfo}>
                                                <span>{item.userId}</span> | <span>{item.date}</span>
                                            </div>
                                            <div className={QnA_b.qnalistUserQuestion}>
                                                {item.secret && item.userId !== currentUser ? '비밀 문의입니다.' : item.question}
                                            </div>
                                            <div className={QnA_b.qnalistDivider}></div>
                                            <div className={QnA_b.qnalistUserAnswer}>
                                                {item.secret && item.userId !== currentUser ? '비밀 문의입니다.' : item.answer || '답변 대기 중'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default qna_boardlist;
