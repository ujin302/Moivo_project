import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from "../../assets/css/ReviewWrite.module.css";
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import { PATH } from '../../../scripts/path';

const ReviewWrite = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // isEdit 상태 추가
    const [isEdit, setIsEdit] = useState(false);
    
    const {
        productId,
        productName,
        paymentDetailId,
        size,
        userName,
        orderDate,
        userId,
        isReviewComplete // 리뷰 작성 완료 여부
    } = location.state || {};

    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const maxLength = 1000; // 최대 글자수 제한

    // 컴포넌트 시작 부분에 existingReview 상태 추가
    const [existingReview, setExistingReview] = useState(null);

    useEffect(() => {
        const loadExistingReview = async () => {
            if (isReviewComplete && paymentDetailId) {
                try {
                    const response = await axiosInstance.get(`${PATH.SERVER}/api/user/review/payment/${paymentDetailId}`);
                    
                    if (response.data) {
                        setRating(response.data.rating);
                        setContent(response.data.content);
                        setIsEdit(true);
                        setExistingReview({
                            ...response.data,
                            id: response.data.id  // 실제 리뷰 ID 사용
                        });
                    }
                } catch (err) {
                    console.error('리뷰 로딩 에러:', err);
                    setError('리뷰를 불러오는데 실패했습니다.');
                }
            }
        };

        if (location.state) {
            loadExistingReview();
        }
    }, [isReviewComplete, paymentDetailId, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                userId: existingReview ? existingReview.userId : userId,
                userName: userName,
                productId: productId,
                size: size ? size.toUpperCase() : "UNKNOWN",
                paymentDetailId: paymentDetailId,
                rating: parseInt(rating, 10),
                content: content.trim(),
                reviewDate: new Date().toISOString(),
            };

            console.log('전송 데이터:', reviewData);
            
            if (isEdit && existingReview?.id) {
                const response = await axiosInstance.put(
                    `/api/user/review/${existingReview.id}`,
                    {
                        id: existingReview.id,  // reviewId 추가
                        userId: existingReview.userId,
                        userName: userName,
                        productId: productId,
                        size: size ? size.toUpperCase() : "UNKNOWN",
                        paymentDetailId: paymentDetailId,
                        rating: parseInt(rating, 10),
                        content: content.trim(),
                        reviewDate: new Date().toISOString()
                    }
                );
                if (response.status === 200) {
                    alert('리뷰가 성공적으로 수정되었습니다.');
                    navigate('/mypage/order');
                }
            } else {
                // 새 리뷰 작성
                const response = await axiosInstance.post(`${PATH.SERVER}/api/user/review`, reviewData);
                console.log('서버 응답:', response);
                if (response.status === 200) {
                    alert('리뷰가 성공적으로 작성되었습니다.');
                    navigate('/mypage/order');
                }
            }
        } catch (err) {
            console.error('에러 발생:', err);
            console.error('에러 응답:', err.response);
            setError(err.response?.data || '리뷰 수정에 실패했습니다.');
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

    // 리뷰 삭제 핸들러 추가
    const handleDelete = async () => {
        if (!window.confirm('리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await axiosInstance.delete(
                `${PATH.SERVER}/api/user/review/${existingReview.id}`
            );

            if (response.status === 200) {
                alert('리뷰가 성공적으로 삭제되었습니다.');
                navigate('/mypage/order');
            }
        } catch (err) {
            console.error('리뷰 삭제 중 에러:', err);
            setError('리뷰 삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <div>
                <Banner />
            </div>

            <div className={styles.reviewWriteContainer}>
                <br/><br/>
                <h1>{isEdit ? '리뷰 수정' : '리뷰 작성'}</h1>
                <div className={styles.productInfo} data-tooltip="구매하신 상품 정보입니다">
                    <h2>{productName}</h2>
                    <p>구매일: {new Date(orderDate).toLocaleDateString()}</p>
                    <p>사이즈:  {size}</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.ratingContainer}>
                        <div className={styles.ratingStars}>
                            {[...Array(5)].reverse().map((_, index) => {
                                const ratingValue = 5 - index;
                                return (
                                    <React.Fragment key={index}>
                                        <input
                                            id={`rating-${ratingValue}`}
                                            className={`${styles.ratingInput} ${styles[`ratingInput${ratingValue}`]}`}
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            checked={rating === ratingValue}
                                            onChange={() => handleStarClick(ratingValue)}
                                        />
                                        <label className={styles.ratingLabel} htmlFor={`rating-${ratingValue}`}>
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
                                            <span className={styles.ratingSr}>{ratingValue} star{ratingValue !== 1 && 's'}</span>
                                        </label>
                                    </React.Fragment>
                                );
                            })}
                            {[...Array(5)].reverse().map((_, index) => {
                                const ratingValue = 5 - index;
                                return (
                                    <p key={index} className={styles.ratingDisplay} data-rating={ratingValue} hidden={rating !== ratingValue}>
                                    </p>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.contentInputWrapper}>
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

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.submitButton}>
                            {isEdit ? '리뷰 수정하기' : '리뷰 등록하기'}
                        </button>
                        {isEdit && ( // 수정 모드일 때만 삭제 버튼 표시
                            <button 
                                type="button" 
                                className={styles.deleteButton}
                                onClick={handleDelete}
                            >
                                리뷰 삭제하기 
                            </button>
                        )}
                        <button 
                            type="button" 
                            className={styles.cancelButton}
                            onClick={() => navigate('/mypage/order')}
                        >
                            취소
                        </button>
                    </div>

                    {isReviewComplete && (
                        <div className={styles.reviewCompleteText}>이미 작성된 리뷰 입니다.</div>
                    )}
                </form>
                <br/>

                {error && <div className={styles.error}>{error}</div>}
            </div>
            
            <Footer />
        </>
    );
};

export default ReviewWrite;

//  지금 리뷰 삭제 하기 버튼 눌렀을 때 삭제 되는 것 확인 필요