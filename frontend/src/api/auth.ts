import apiClient, { setToken, removeToken } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiResponse,
  UserInfo,
} from '@/types/api';

/**
 * 用户登录
 * @param username 用户名
 * @param password 密码
 * @returns 登录响应数据（包含 token 和用户信息）
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const requestData: LoginRequest = {
    username,
    password,
  };

  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    requestData
  );

  // 登录成功后保存 token
  if (response.data.access_token) {
    setToken(response.data.access_token);
  }

  return response.data;
};

/**
 * 用户注册
 * @param data 注册请求数据
 * @returns 注册成功后的用户信息
 */
export const register = async (
  data: RegisterRequest
): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.post<ApiResponse<UserInfo>>(
    '/auth/register',
    data
  );

  return response.data;
};

/**
 * 用户登出
 * 清除本地存储的 token 和用户信息
 */
export const logout = (): void => {
  removeToken();
};

/**
 * 获取当前登录用户信息
 * @returns 用户信息
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.get<ApiResponse<UserInfo>>('/auth/me');

  return response.data;
};

/**
 * 验证 token 是否有效
 * @returns token 是否有效
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 更新用户信息
 * @param data 要更新的用户信息
 * @returns 更新后的用户信息
 */
export const updateProfile = async (
  data: Partial<
    Pick<UserInfo, 'email' | 'real_name' | 'phone'>
  >
): Promise<ApiResponse<UserInfo>> => {
  const response = await apiClient.put<ApiResponse<UserInfo>>(
    '/auth/profile',
    data
  );

  return response.data;
};

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 操作结果
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<ApiResponse<null>> => {
  const response = await apiClient.put<ApiResponse<null>>(
    '/auth/password',
    {
      old_password: oldPassword,
      new_password: newPassword,
    }
  );

  return response.data;
};