import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from '../../../scripts/path';
import styles from "../../assets/css/ReviewWrite.module.css";
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';
import { FaPen } from 'react-icons/fa';

const ReviewWrite = () => {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const productId = location.state?.productId;
    const [emojis] = useState(['😀', '😍', '😮', '😢', '😡']);
    const [selectedEmojis, setSelectedEmojis] = useState([]);
    const [hashtags, setHashtags] = useState('');
    const maxLength = 1000;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('id');

        try {
            await axiosInstance.post(`${PATH.SERVER}/api/user/review`, {
                rating,
                content,
                userId,
                productId
            });
            alert('리뷰가 성공적으로 작성되었습니다.');
            navigate('/product-detail/' + productId);
        } catch (err) {
            console.error('리뷰 작성 실패:', err);
            setError('리뷰 작성에 실패했습니다.');
        }
    };

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleEmojiClick = (emoji) => {
        const index = selectedEmojis.indexOf(emoji);
        if (index > -1) {
            setSelectedEmojis(selectedEmojis.filter((_, i) => i !== index));
        } else {
            setSelectedEmojis([...selectedEmojis, emoji]);
        }
    };

    return (
        <>
            <div>
                <Banner />
            </div>

        <div className={styles.reviewWriteContainer}>
            <h1>리뷰 작성</h1>
            {error && <div className={styles.error}>{error}</div>}
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
                        required
                    />
                    <div className={styles.characterCount}>
                        <span className={styles.remainingChars}>{maxLength - content.length}</span>/{maxLength}
                    </div>
                </div>
                <div>
                    <label>해시태그:</label>
                    <input
                        type="text"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        placeholder="해시태그를 입력하세요 (쉼표로 구분)"
                        className={styles.hashtagInput}
                    />
                </div>
                <div className={styles.preview}>
                    <h3>리뷰 미리보기</h3>
                    <div>
                        {[...Array(rating)].map((_, index) => (
                            <span key={index}>&#9733;</span>
                        ))}
                    </div>
                    <p>{content}</p>
                    <div>
                        {selectedEmojis.map((emoji, index) => (
                            <span key={index}>{emoji}</span>
                        ))}
                    </div>
                    <div className={styles.hashtagList}>
                        {hashtags.split(',').map((tag, index) => (
                            <span key={index} className={styles.hashtag}>
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>
                <button type="submit">리뷰 작성</button>
            </form>
        </div>
        
        <Footer />
        </>
    );
};

export default ReviewWrite;
