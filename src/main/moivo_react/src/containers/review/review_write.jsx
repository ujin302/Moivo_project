import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from '../../../scripts/path';
import styles from "../../assets/css/ReviewWrite.module.css";
import Banner from '../../components/Banner/banner';
import Footer from '../../components/Footer/Footer';

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
                    <label>평점:</label>
                    {[...Array(5)].map((_, index) => (
                        <span
                            key={index}
                            className={`${styles.star} ${
                                index < rating ? styles.selected : ''
                            } ${rating === index + 1 ? styles.burst : ''}`}
                            onClick={() => handleStarClick(index + 1)}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>
                <div>
                    <label>내용:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className={styles.characterCount}>
                        {content.length}/1000
                    </div>
                    <div className={styles.emojiPicker}>
                        {emojis.map((emoji, index) => (
                            <span
                                key={index}
                                className={`${styles.emoji} ${
                                    selectedEmojis.includes(emoji) ? styles.selected : ''
                                }`}
                                onClick={() => handleEmojiClick(emoji)}
                            >
                                {emoji}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <label>해시태그:</label>
                    <input
                        type="text"
                        value={hashtags}
                        onChange={(e) => setHashtags(e.target.value)}
                        placeholder="해시태그를 입력하세요 (쉼표로 구분)"
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
                    <p>{hashtags}</p>
                </div>
                <button type="submit">리뷰 작성</button>
            </form>
        </div>
        
        <Footer />
        </>
    );
};

export default ReviewWrite;
