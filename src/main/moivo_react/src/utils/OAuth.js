import { PATH } from '../../scripts/path';

const CLIENT_ID = "f7a7c7e3336c98e0e10ec97636ac08fa";
const REDIRECT_URI = `${PATH.CLIENT}/api/oauth/kakao/callback`;


export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

//_ 241210_yjy