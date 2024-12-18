import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from '../../../scripts/path';
import styles from "../../assets/css/ReviewWrite.module.css";
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import { FaPen } from 'react-icons/fa';

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    // console.log('요청 헤더의 토큰:', token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const ReviewWrite = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // location.state에서 모든 필요한 데이터 추출
    const {
        productId,
        productName,
        paymentDetailId,
        size,
        userName,
        orderDate
    } = location.state || {};

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const maxLength = 1000; // 최대 글자수 제한

    useEffect(() => {
        console.log("전달받은 데이터:", location.state);
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            
            const reviewData = {
                userId: decodedPayload.id,
                userName,
                productId,
                size: size.toUpperCase(),
                paymentDetailId,
                rating,
                content,
                reviewDate: new Date().toISOString()
            };
            
            console.log('전송할 리뷰 데이터:', reviewData);
            const response = await axiosInstance.post(`${PATH.SERVER}/api/user/review`, reviewData);
            console.log('서버 응답:', response);
            
            alert('리뷰가 성공적으로 작성되었습니다.');
            navigate('/mypage/order');
        } catch (err) {
            console.error('에러 발생:', err);
            setError(err.response?.data || '리뷰 작성에 실패했습니다.');
        }
    };

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    // 글자수 경고 상태 추가
    const getCharacterCountClass = () => {
        const remaining = maxLength - content.length;
        if (remaining < 50) return styles.danger;
        if (remaining < 200) return styles.warning;
        return '';
    };

    return (
        <>
            <div>
                <Banner />
            </div>

            <div className={styles.reviewWriteContainer}>
                <h1>리뷰 작성</h1>
                {error && <div className={styles.error}>{error}</div>}
                
                <div className={styles.productInfo} data-tooltip="구매하신 상품 정보입니다">
                    <h2>{productName}</h2>
                    <p>구매일: {new Date(orderDate).toLocaleDateString()}</p>
                    <p>사이즈: {size}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.ratingContainer}>
                        <div className={styles.ratingStars}>
                            {[...Array(5)].map((_, index) => (
                                <React.Fragment key={index}>
                                    <input
                                        id={`rating-${index + 1}`}
                                        className={`${styles.ratingInput} ${styles[`ratingInput${index + 1}`]}`}
                                        type="radio"
                                        name="rating"
                                        value={index + 1}
                                        checked={rating === index + 1}
                                        onChange={() => handleStarClick(index + 1)}
                                    />
                                    <label className={styles.ratingLabel} htmlFor={`rating-${index + 1}`}>
                                        <svg className={styles.ratingStar} width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
                                            <g transform="translate(16,16)">
                                                <circle className={styles.ratingStarRing} fill="none" stroke="#000" strokeWidth="16" r="8" transform="scale(0)" />
                                            </g>
                                            <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <g transform="translate(16,16) rotate(180)">
                                                    <polygon className={styles.ratingStarStroke} points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="none" />
                                                    <polygon className={styles.ratingStarFill} points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="#000" />
                                                </g>
                                                <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                                                    <polyline className={styles.ratingStarLine} transform="rotate(0)" points="0 4,0 16" />
                                                    <polyline className={styles.ratingStarLine} transform="rotate(72)" points="0 4,0 16" />
                                                    <polyline className={styles.ratingStarLine} transform="rotate(144)" points="0 4,0 16" />
                                                    <polyline className={styles.ratingStarLine} transform="rotate(216)" points="0 4,0 16" />
                                                    <polyline className={styles.ratingStarLine} transform="rotate(288)" points="0 4,0 16" />
                                                </g>
                                            </g>
                                        </svg>
                                        <span className={styles.ratingSr}>{index + 1} star{index !== 0 && 's'}</span>
                                    </label>
                                </React.Fragment>
                            ))}
                            {[...Array(5)].map((_, index) => (
                                <p key={index} className={styles.ratingDisplay} data-rating={index + 1} hidden={rating !== index + 1}>
                                    {['끔찍해요', '별로에요', '보통이에요', '좋아요', '최고에요'][index]}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className={styles.contentInputWrapper}>
                        <FaPen className={styles.contentIcon} />
                        <textarea
                            className={styles.contentInput}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="상품에 대한 솔직한 리뷰를 작성해주세요."
                            required
                        />
                        <div className={`${styles.characterCount} ${getCharacterCountClass()}`}>
                            <span className={styles.remainingChars}>{maxLength - content.length}</span>/{maxLength}
                        </div>
                    </div>

                    <div className={styles.preview}>
                        <h3>리뷰 미리보기</h3>
                        <div className={styles.previewContent}>
                            <p className={styles.previewProductName}>{productName}</p>
                            <p className={styles.previewDate}>구매일: {new Date(orderDate).toLocaleDateString()}</p>
                            <div className={styles.previewRating}>
                                {[...Array(rating)].map((_, index) => (
                                    <span key={index}>&#9733;</span>
                                ))}
                            </div>
                            <p className={styles.previewText}>{content}</p>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        리뷰 등록하기
                    </button>
                </form>
            </div>
            
            <Footer />
        </>
    );
};

export default ReviewWrite;
