import apiClient from './client';
import type {
  OccupancyStatistics,
  RepairStatistics,
  ChargeStatistics,
} from '@/types/api';

/** 获取入住率统计 */
export const getOccupancyStatistics = async (): Promise<OccupancyStatistics> => {
  const response = await apiClient.get<OccupancyStatistics>(
    '/statistics/occupancy'
  );
  return response.data;
};

/** 获取报修统计 */
export const getRepairStatistics = async (): Promise<RepairStatistics> => {
  const response = await apiClient.get<RepairStatistics>('/statistics/repairs');
  return response.data;
};

/** 获取费用统计 */
export const getChargeStatistics = async (): Promise<ChargeStatistics> => {
  const response = await apiClient.get<ChargeStatistics>('/statistics/charges');
  return response.data;
};