import apiClient from './client';
import type { Announcement } from '@/types/api';

/** 获取公告列表 */
export const getAnnouncements = async (
  params?: { page?: number; page_size?: number }
): Promise<{ items: Announcement[] }> => {
  const response = await apiClient.get<Announcement[]>('/announcements', {
    params,
  });

  // 后端返回数组，前端需要包装成 { items: [] } 格式
  return { items: response.data };
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

/** 创建公告（管理员） */
export const createAnnouncement = async (data: {
  title: string;
  summary: string;
  content: string;
  is_pinned?: boolean;
  author: string;
}): Promise<Announcement> => {
  const response = await apiClient.post<Announcement>('/announcements', data);
  return response.data;
};

/** 更新公告（管理员） */
export const updateAnnouncement = async (
  announcementId: number,
  data: Partial<{
    title: string;
    summary: string;
    content: string;
    is_pinned: boolean;
    author: string;
  }>
): Promise<Announcement> => {
  const response = await apiClient.put<Announcement>(
    `/announcements/${announcementId}`,
    data
  );
  return response.data;
};

/** 删除公告（管理员） */
export const deleteAnnouncement = async (
  announcementId: number
): Promise<void> => {
  await apiClient.delete(`/announcements/${announcementId}`);
};