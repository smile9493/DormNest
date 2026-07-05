import apiClient from './client';
import type {
  Building,
  BuildingsResponse,
  Dormitory,
  DormitoriesRequest,
  DormitoriesResponse,
  DormitoryDetailResponse,
  DormitoryStatus,
} from '@/types/api';

/** 获取楼栋列表 */
export const getBuildings = async (): Promise<BuildingsResponse> => {
  const response = await apiClient.get<BuildingsResponse>('/buildings');
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
  params?: { page?: number; page_size?: number }
): Promise<DormitoriesResponse> => {
  const queryParams: DormitoriesRequest = { ...params };

  if (buildId !== undefined) {
    queryParams.build_id = buildId;
  }

  if (status !== undefined) {
    queryParams.status = status;
  }

  const response = await apiClient.get<DormitoriesResponse>('/dormitories', {
    params: queryParams,
  });

  return response.data;
};

/** 获取单个宿舍详情 */
export const getDormitoryById = async (
  dormitoryId: number
): Promise<DormitoryDetailResponse> => {
  const response = await apiClient.get<DormitoryDetailResponse>(
    `/dormitories/${dormitoryId}`
  );
  return response.data;
};