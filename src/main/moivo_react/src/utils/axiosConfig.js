import axios from 'axios';
import { PATH } from '../../scripts/path';
// yjy 만듬

const axiosInstance = axios.create({
  baseURL: PATH.SERVER,
  withCredentials: true,
});
axiosInstance()
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {  //토큰 존재 여부 체크
      config.headers.Authorization = `Bearer ${token}`;  //있으면 헤더에 추가
    }
    return config;    // 토큰 없으면 그대로 반환
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${PATH.SERVER}/api/auth/token/refresh`,
          {},
          { withCredentials: true }
        );

        const { newAccessToken } = response.data;
        
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/user';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 404) {
      return Promise.resolve({ data: null });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
