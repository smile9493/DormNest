import apiClient from './client';
import type { Repair, RepairStatus, RepairCreateRequest, RepairStatusUpdateRequest } from '@/types/api';

/** 获取报修工单列表 */
export const getRepairs = async (
  status?: RepairStatus,
  params?: { skip?: number; limit?: number }
): Promise<Repair[]> => {
  const queryParams: Record<string, unknown> = { ...params };

  if (status !== undefined) {
    queryParams.status = status;
  }

  const response = await apiClient.get<Repair[]>('/repairs', {
    params: queryParams,
  });

  return response.data;
};

/** 获取单个报修工单详情 */
export const getRepairById = async (repairId: number): Promise<Repair> => {
  const response = await apiClient.get<Repair>(`/repairs/${repairId}`);
  return response.data;
};

/** 创建报修工单 */
export const createRepair = async (data: RepairCreateRequest): Promise<Repair> => {
  const response = await apiClient.post<Repair>('/repairs', data);
  return response.data;
};

/** 更新报修工单状态 */
export const updateRepairStatus = async (
  repairId: number,
  data: RepairStatusUpdateRequest
): Promise<Repair> => {
  const response = await apiClient.put<Repair>(`/repairs/${repairId}/status`, data);
  return response.data;
};
