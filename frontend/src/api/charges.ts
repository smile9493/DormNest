import apiClient from './client';
import type { Charge } from '@/types/api';

/** 获取费用列表（当前用户） */
export const getMyCharges = async (
  params?: { page?: number; page_size?: number }
): Promise<{ items: Charge[] }> => {
  const response = await apiClient.get<Charge[]>('/charges/me', {
    params,
  });

  // 后端返回数组，前端需要包装成 { items: [] } 格式
  return { items: response.data };
};

/** 获取所有费用列表（管理员） */
export const getAllCharges = async (
  params?: { page?: number; page_size?: number }
): Promise<{ items: Charge[] }> => {
  const response = await apiClient.get<Charge[]>('/charges', {
    params,
  });

  // 后端返回数组，前端需要包装成 { items: [] } 格式
  return { items: response.data };
};

/** 获取单个费用详情 */
export const getChargeById = async (chargeId: number): Promise<Charge> => {
  const response = await apiClient.get<Charge>(`/charges/${chargeId}`);
  return response.data;
};

/** 缴费 */
export const payCharge = async (chargeId: number): Promise<Charge> => {
  const response = await apiClient.post<Charge>(`/charges/${chargeId}/pay`);
  return response.data;
};