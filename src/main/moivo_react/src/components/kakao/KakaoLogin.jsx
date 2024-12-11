import React from 'react';
import { KAKAO_AUTH_URL } from '../../utils/OAuth';
import kakaoLoginImage from '../../assets/image/kakao_login.png';

const KakaoLogin = () => {
  return (
    <a href={KAKAO_AUTH_URL}>
      <img src={kakaoLoginImage} alt="카카오 로그인" style={{cursor: 'pointer'}} />
    </a>
  );
};

export default KakaoLogin;  //_ 241210_yjy