import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// 토큰이 필요한 인스턴스
const authInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

authInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${baseUrl}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// 토큰이 필요 없는 인스턴스
const publicInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

publicInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = authInstance;
export const publicApi = publicInstance;
