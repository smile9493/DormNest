import apiClient from './client';
import type { Charge, ChargePayRequest } from '@/types/api';

/** 获取费用列表（当前用户） */
export const getMyCharges = async (
  params?: { skip?: number; limit?: number }
): Promise<Charge[]> => {
  const response = await apiClient.get<Charge[]>('/charges/me', {
    params,
  });
  return response.data;
};

/** 获取指定学生的费用列表（管理员） */
export const getStudentCharges = async (
  studentId: number,
  params?: { skip?: number; limit?: number }
): Promise<Charge[]> => {
  const response = await apiClient.get<Charge[]>(`/charges/student/${studentId}`, {
    params,
  });
  return response.data;
};

/** 缴费 */
export const payCharge = async (
  chargeId: number,
  data?: ChargePayRequest
): Promise<Charge> => {
  const response = await apiClient.post<Charge>(`/charges/pay/${chargeId}`, data);
  return response.data;
};
