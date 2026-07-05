import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

/**
 * Axios 实例配置
 * 基础 URL: 优先使用环境变量，回退到 localhost
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 401 并发保护标志
let isHandling401 = false;

/**
 * 请求拦截器
 * 自动添加 JWT Token 到请求头
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 统一处理错误响应
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 并发保护：仅首个 401 触发清除逻辑
          if (!isHandling401) {
            isHandling401 = true;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');

            if (window.location.pathname !== '/login') {
              // 保存原始路径用于登录后重定向
              const redirect = encodeURIComponent(window.location.pathname + window.location.search);
              window.location.href = `/login?redirect=${redirect}`;
            }

            // 重置标志（页面跳转后自然重置，此处为保险）
            setTimeout(() => { isHandling401 = false; }, 1000);
          }
          break;

        case 403:
          console.error('权限不足:', data?.message || '无权访问该资源');
          break;

        case 404:
          console.error('资源不存在:', data?.message || '请求的资源不存在');
          break;

        case 422:
          console.error('数据验证失败:', data?.message || '请求数据格式错误');
          break;

        case 500:
          console.error('服务器错误:', data?.message || '服务器内部错误');
          break;

        default:
          console.error('请求失败:', data?.message || '未知错误');
      }

      return Promise.reject({
        code: data?.code || status,
        message: data?.message || '请求失败',
        details: data?.details,
      } as ApiError);
    }

    // 网络错误或请求超时
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        code: 0,
        message: '请求超时，请检查网络连接',
      } as ApiError);
    }

    return Promise.reject({
      code: 0,
      message: error.message || '网络错误',
    } as ApiError);
  }
);

/**
 * 获取存储的 token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * 设置 token
 */
export const setToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

/**
 * 移除 token
 */
export const removeToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info');
};

export default apiClient;
