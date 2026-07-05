import apiClient from './client';
import type { Announcement } from '@/types/api';

/** 获取公告列表 */
export const getAnnouncements = async (
  params?: { skip?: number; limit?: number; category?: string }
): Promise<Announcement[]> => {
  const response = await apiClient.get<Announcement[]>('/announcements', {
    params,
  });
  return response.data;
};

/** 获取单个公告详情 */
export const getAnnouncementById = async (
  announcementId: number
): Promise<Announcement> => {
  const response = await apiClient.get<Announcement>(
    `/announcements/${announcementId}`
  );
  return response.data;
};
