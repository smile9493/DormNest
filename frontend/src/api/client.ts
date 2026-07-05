import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

/**
 * Axios 实例配置
 * 基础 URL: http://localhost:8000/api/v1
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * 自动添加 JWT Token 到请求头
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('access_token');

    // 如果 token 存在，添加到 Authorization 头
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
  (response) => {
    // 成功响应直接返回
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // 处理不同的 HTTP 错误状态码
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token 过期或无效，清除本地存储并跳转到登录页
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_info');

          // 如果不在登录页，则跳转到登录页
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;

        case 403:
          // 权限不足
          console.error('权限不足:', data?.message || '无权访问该资源');
          break;

        case 404:
          // 资源不存在
          console.error('资源不存在:', data?.message || '请求的资源不存在');
          break;

        case 422:
          // 验证错误
          console.error('数据验证失败:', data?.message || '请求数据格式错误');
          break;

        case 500:
          // 服务器内部错误
          console.error('服务器错误:', data?.message || '服务器内部错误');
          break;

        default:
          console.error('请求失败:', data?.message || '未知错误');
      }

      // 返回标准化的错误对象
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

    // 其他错误
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