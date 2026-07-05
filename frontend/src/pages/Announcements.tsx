import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Clock, Pin, RefreshCw, Eye } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { getAnnouncements } from '@/api';
import type { Announcement } from '@/types/api';

export default function Announcements() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  // 获取公告列表
  const {
    data: announcementsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => getAnnouncements({ page: 1, page_size: 50 }),
  });

  const announcements = announcementsData?.items || [];

  // 按置顶和时间排序
  const sortedAnnouncements = [...announcements].sort((a: Announcement, b: Announcement) => {
    if (a.is_top && !b.is_top) return -1;
    if (!a.is_top && b.is_top) return 1;
    return new Date(b.publish_time || b.created_at).getTime() - new Date(a.publish_time || a.created_at).getTime();
  });

  const handleRefresh = () => {
    refetch();
  };

  // 查看公告详情
  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  // 友好时间显示函数
  const formatFriendlyTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公告通知</h1>
          <p className="text-gray-600 mt-1">查看最新宿舍公告和通知信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            刷新数据
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Bell className="h-4 w-4" />
            <span>共 {announcements.length} 条公告</span>
          </div>
        </div>
      </div>

      {/* 公告卡片列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <Card shadow="md" className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <Bell className="h-5 w-5" />
            <p className="text-sm">公告数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAnnouncements.map((announcement: Announcement) => (
            <Card
              key={announcement.announcement_id}
              shadow="lg"
              padding="none"
              className={`hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 ${
                announcement.is_top 
                  ? 'border-[#F59E0B]/30 bg-gradient-to-r from-[#F59E0B]/5 to-[#FBBF24]/5' 
                  : 'border-gray-100 hover:border-[#1E40AF]/20'
              }`}
            >
              {/* 置顶标识条 */}
              {announcement.is_top && (
                <div className="h-2 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]"></div>
              )}
              
              <Card.Content className="py-5">
                <div className="flex items-start gap-4">
                  {/* 置顶图标 */}
                  {announcement.is_top && (
                    <div className="flex-shrink-0">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] shadow-lg transform rotate-12">
                        <Pin className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* 公告内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 
                            className="text-xl font-bold text-gray-900 hover:text-[#1E40AF] transition-colors cursor-pointer"
                            onClick={() => handleViewAnnouncement(announcement)}
                          >
                            {announcement.title}
                          </h3>
                          {announcement.is_top && (
                            <Badge variant="warning" size="sm" className="shadow-md animate-pulse">
                              <span className="font-semibold">置顶</span>
                            </Badge>
                          )}
                        </div>
                        <p 
                          className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed cursor-pointer hover:text-gray-800 transition-colors"
                          onClick={() => handleViewAnnouncement(announcement)}
                        >
                          {announcement.content.substring(0, 100)}
                        </p>
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#10B981]/10">
                            <Clock className="h-4 w-4 text-[#10B981]" />
                            <span className="font-medium text-[#10B981]">
                              {formatFriendlyTime(announcement.publish_time || announcement.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                管
                              </span>
                            </div>
                            <span className="font-medium">管理员</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 查看详情按钮 */}
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Eye className="h-4 w-4" />}
                      onClick={() => handleViewAnnouncement(announcement)}
                      className="hover:shadow-lg transition-all"
                    >
                      查看详情
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && announcements.length === 0 && (
        <Card shadow="md" padding="lg">
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无公告通知</p>
          </div>
        </Card>
      )}

      {/* 公告统计 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card shadow="lg" padding="md" className="border-2 border-gray-100 hover:border-[#F59E0B]/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">置顶公告</p>
                <p className="text-3xl font-bold text-[#F59E0B]">
                  {announcements.filter((a: Announcement) => a.is_pinned).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  重要通知
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] shadow-lg transform rotate-12">
                <Pin className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>
          
          <Card shadow="lg" padding="md" className="border-2 border-gray-100 hover:border-[#1E40AF]/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">本周公告</p>
                <p className="text-3xl font-bold text-[#1E40AF]">
                  {announcements.filter((a: Announcement) => {
                    const publishedDate = new Date(a.published_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return publishedDate >= weekAgo;
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  最新动态
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] shadow-lg">
                <Bell className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}