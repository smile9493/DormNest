import apiClient from './client';
import type {
  Building,
  Dormitory,
  DormitoriesRequest,
  DormitoryStatus,
} from '@/types/api';

/** 获取楼栋列表 */
export const getBuildings = async (): Promise<Building[]> => {
  const response = await apiClient.get<Building[]>('/buildings');
  return response.data;
};

/** 获取单个楼栋详情 */
export const getBuildingById = async (
  buildingId: number
): Promise<Building> => {
  const response = await apiClient.get<Building>(`/buildings/${buildingId}`);
  return response.data;
};

/** 获取宿舍列表 */
export const getDormitories = async (
  buildId?: number,
  status?: DormitoryStatus,
  params?: { skip?: number; limit?: number }
): Promise<Dormitory[]> => {
  const queryParams: DormitoriesRequest = { ...params };

  if (buildId !== undefined) {
    queryParams.build_id = buildId;
  }

  if (status !== undefined) {
    queryParams.status = status;
  }

  const response = await apiClient.get<Dormitory[]>('/dormitories', {
    params: queryParams,
  });

  return response.data;
};

/** 获取单个宿舍详情 */
export const getDormitoryById = async (
  dormitoryId: number
): Promise<Dormitory> => {
  const response = await apiClient.get<Dormitory>(
    `/dormitories/${dormitoryId}`
  );
  return response.data;
};
