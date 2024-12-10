import axios from "axios";
import { PATH } from "../../scripts/path";

const apiClient = axios.create({
    baseURL: PATH.SERVER,
    withCredentials: true
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//응답 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(
                    `${PATH.SERVER}/api/auth/token/refresh`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken, expiration } = response.data;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("tokenExpiration", expiration);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                location.href = "/user";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;