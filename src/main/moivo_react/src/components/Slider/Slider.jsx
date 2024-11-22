// src/components/Slider/Slider.jsx
import React, { useEffect, useState } from 'react';
import styles from "../../assets/css/Slider.module.css";

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1617331140180-e8262094733a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    "https://images.unsplash.com/photo-1571867424488-4565932edb41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80", 
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1386&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.carouselInner} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className={`${styles.carouselItem} ${index === activeIndex ? styles.active : ''}`}>
            <img src={image} alt={`Fashion Image ${index + 1}`} className={styles.carouselImage} />
            <div className={styles.carouselCaption}>
              <h2 className={styles.captionTitle}>Discover Your Style</h2>
              <p className={styles.captionText}>Explore the latest fashion trends</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.carouselNav}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.carouselNavItem} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => setActiveIndex(index)}
          ></span>
        ))}
      </div>
      <button className={styles.carouselControlPrev} onClick={goToPrevious}>
        &#10094;
      </button>
      <button className={styles.carouselControlNext} onClick={goToNext}>
        &#10095;
      </button>
    </div>
  );
};

export default Slider;
