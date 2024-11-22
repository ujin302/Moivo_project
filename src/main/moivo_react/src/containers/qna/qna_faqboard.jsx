import React, { useState } from 'react';
import QnA from '../../assets/css/qna_faqboard.module.css';
import Footer from './../../components/Footer/Footer';
import Banner from '../../components/Banner/banner';
import { Link } from 'react-router-dom';

const qna_faqboard = () => {
  // FAQ 열림 상태 관리
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleToggle = (id) => {
      // 동일한 항목을 클릭하면 닫고, 새 항목을 클릭하면 열리도록 처리
      setOpenFAQ(openFAQ === id ? null : id);
  };

    return (
        <div className={QnA.faqmainDiv}>
            <div><Banner /></div>
            <div className={QnA.faqheader}></div>
            <div className={QnA.faqcoment}> 고객센터 </div>
            <div className={QnA.faqDiv}>
                
            {/* 고객센터 네비*/}
            <div className={QnA.faqNavi}>
                <Link to="/qna_faqboard">
                    <button className={QnA.faqNaviBtn}>자주 묻는 질문</button>
                 </Link>
    
                <Link to="/qna_board">
                    <button className={QnA.faqNaviBtn}>문의 작성하기</button>
                </Link>

                <Link to="/qna_boardlist">
                    <button className={QnA.faqNaviBtn}>문의 게시글</button>
                </Link>
            </div>
                
                <div className={QnA.faq}>
                    {/* FAQ 항목 1 */}
                    <div className={QnA.faqItem}>
                        <input id="faq-a" type="checkbox" checked={openFAQ === 'faq-a'} onChange={() => handleToggle('faq-a')}/>
                        <label htmlFor="faq-a">
                            <p className={QnA.faqHeading}>회원가입은 어떻게 하는건가요?</p>
                            <div className={QnA.faqArrow} ></div>
                        </label>
                        {openFAQ === 'faq-a' && (
                            <p className={QnA.faqText}>
                                로그인 화면에서 'SigUp' 버튼을 누르시면 회원가입 화면으로 이동하게 됩니다.
                                <br /><br />
                                회원가입 화면에서 보이시는 요소에 개인 정보를 입력하시고 '회원가입' 버튼을 누르시면 회원가입이 완료됩니다.
                            </p>
                        )}
                    </div>

                    {/* FAQ 항목 2 */}
                    <div className={QnA.faqItem}>
                        <input id="faq-b" type="checkbox" checked={openFAQ === 'faq-b'} onChange={() => handleToggle('faq-b')}/>
                        <label htmlFor="faq-b">
                            <p className={QnA.faqHeading}>내 주문을 취소할 수 있나요?</p>
                            <div className={QnA.faqArrow}></div>
                        </label>
                        {openFAQ === 'faq-b' && (
                            <p className={QnA.faqText}>
                                네, 가능합니다. 주문을 취소하려면, 상품이 배송 준비 상태에 들어가기 전에 취소 요청을 해주세요. 
                                <br /><br />
                                주문 상태가 '배송 준비 중'인 경우에는 취소가 어려울 수 있습니다. 빠른 취소를 원하시면 고객센터에 문의해주세요.
                            </p>
                        )}
                    </div>

                    {/* FAQ 항목 3 */}
                    <div className={QnA.faqItem}>
                        <input id="faq-c" type="checkbox" checked={openFAQ === 'faq-c'} onChange={() => handleToggle('faq-c')}/>
                        <label htmlFor="faq-c">
                            <p className={QnA.faqHeading}>반품은 어떻게 하나요?</p>
                            <div className={QnA.faqArrow}></div>
                        </label>
                        {openFAQ === 'faq-c' && (
                            <p className={QnA.faqText}>
                                상품을 반품하고자 하실 경우, 배송 받은 날로부터 7일 이내에 반품 요청을 해주셔야 합니다.
                                <br /><br />
                                상품은 미사용 상태여야 하며, 원래의 포장 상태를 유지해야 합니다. 반품 절차는 고객센터를 통해 안내드립니다.
                            </p>
                        )}
                    </div>

                    {/* FAQ 항목 4 */}
                    <div className={QnA.faqItem}>
                        <input id="faq-d" type="checkbox" checked={openFAQ === 'faq-d'} onChange={() => handleToggle('faq-d')}/>
                        <label htmlFor="faq-d">
                            <p className={QnA.faqHeading}>상품은 언제 배송되나요?</p>
                            <div className={QnA.faqArrow}></div>
                        </label>
                        {openFAQ === 'faq-d' && (
                            <p className={QnA.faqText}>
                                주문 후 1~3일 이내에 상품이 출고됩니다. 단, 주문량이나 특정 이벤트에 따라 배송이 지연될 수 있습니다. 배송 추적 정보는 배송 완료 후 제공됩니다.
                            </p>
                        )}
                    </div>

                    {/* FAQ 항목 5 */}
                    <div className={QnA.faqItem}>
                        <input id="faq-e" type="checkbox" checked={openFAQ === 'faq-e'}onChange={() => handleToggle('faq-e')}/>
                        <label htmlFor="faq-e">
                            <p className={QnA.faqHeading}>할인 쿠폰은 어떻게 사용하나요?</p>
                            <div className={QnA.faqArrow}></div>
                        </label>
                        {openFAQ === 'faq-e' && (
                            <p className={QnA.faqText}>
                                할인 쿠폰은 결제 페이지에서 입력란에 쿠폰 코드를 입력하시면 자동으로 할인이 적용됩니다. 쿠폰은 유효 기간이 있으므로 사용 전에 확인해 주세요.
                            </p>
                        )}
                    </div>

                    {/* FAQ 항목 6 */}
                    <div className={QnA.faqItem}>
                        <input id="faq-f" type="checkbox" checked={openFAQ === 'faq-f'} onChange={() => handleToggle('faq-f')}/>
                        <label htmlFor="faq-f">
                            <p className={QnA.faqHeading}>사이즈가 맞지 않으면 교환이 가능한가요?</p>
                            <div className={QnA.faqArrow}></div>
                        </label>
                        {openFAQ === 'faq-f' && (
                            <p className={QnA.faqText}>
                                상품을 받은 후 7일 이내에 사이즈 교환 요청을 하실 수 있습니다. 교환이 가능한 조건은 상품이 미사용 상태일 때입니다. 
                                <br /><br />
                                교환 절차는 고객센터를 통해 안내드리며, 배송비는 고객 부담이 될 수 있습니다.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
        );
};

export default qna_faqboard;