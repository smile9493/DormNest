import apiClient from './client';
import type { Repair, RepairStatus } from '@/types/api';

/** 获取报修工单列表 */
export const getRepairs = async (
  status?: RepairStatus,
  params?: { page?: number; page_size?: number }
): Promise<{ items: Repair[] }> => {
  const queryParams: any = { ...params };

  if (status !== undefined) {
    queryParams.status = status;
  }

  const response = await apiClient.get<Repair[]>('/repairs', {
    params: queryParams,
  });

  // 后端返回数组，前端需要包装成 { items: [] } 格式
  return { items: response.data };
};

/** 获取单个报修工单详情 */
export const getRepairById = async (repairId: number): Promise<Repair> => {
  const response = await apiClient.get<Repair>(`/repairs/${repairId}`);
  return response.data;
};

/** 创建报修工单 */
export const createRepair = async (data: {
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  location: string;
}): Promise<Repair> => {
  const response = await apiClient.post<Repair>('/repairs', data);
  return response.data;
};

/** 更新报修工单状态 */
export const updateRepairStatus = async (
  repairId: number,
  status: RepairStatus
): Promise<Repair> => {
  const response = await apiClient.put<Repair>(`/repairs/${repairId}/status`, {
    status,
  });
  return response.data;
};