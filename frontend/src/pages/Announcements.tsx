import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Search, RefreshCw, AlertTriangle, Pin, Clock, Eye } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { getAnnouncements } from '@/api';
import type { Announcement } from '@/types/api';

export default function Announcements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // 获取公告列表
  const {
    data: announcements,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['announcements', filterCategory],
    queryFn: () => getAnnouncements(
      filterCategory === 'all' ? undefined : { category: filterCategory }
    ),
  });

  const filteredAnnouncements = announcements?.filter((item: Announcement) =>
    searchTerm === '' ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categoryColors: Record<string, string> = {
    '通知': 'bg-[#3B82F6]/10 text-[#1E40AF] border-[#3B82F6]/20',
    '公告': 'bg-[#10B981]/10 text-[#059669] border-[#10B981]/20',
    '紧急': 'bg-[#EF4444]/10 text-[#DC2626] border-[#EF4444]/20',
    '活动': 'bg-[#8B5CF6]/10 text-[#7C3AED] border-[#8B5CF6]/20',
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公告通知</h1>
          <p className="text-gray-500 mt-1">查看宿舍管理相关公告和通知</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={() => refetch()}
          disabled={isLoading}
        >
          刷新数据
        </Button>
      </div>

      {/* 搜索栏 */}
      <Card shadow="md" className="border border-gray-100">
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="w-64">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1E40AF] transition-colors" />
                <input
                  type="text"
                  placeholder="搜索公告标题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white hover:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', '通知', '公告', '紧急', '活动'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    filterCategory === cat
                      ? 'bg-[#1E40AF] text-white shadow-lg transform scale-105'
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Card shadow="md" className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">公告数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* 公告列表 */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement: Announcement) => (
            <Card
              key={announcement.announcement_id}
              shadow="md"
              className={`border hover:shadow-lg transition-shadow ${
                announcement.is_top ? 'border-[#EF4444]/30 bg-gradient-to-r from-[#EF4444]/5 to-white' : 'border-gray-100'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {announcement.is_top && (
                      <div className="p-2 rounded-lg bg-[#EF4444]/10">
                        <Pin className="h-4 w-4 text-[#EF4444]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {announcement.category && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                            categoryColors[announcement.category] || 'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {announcement.category}
                          </span>
                        )}
                        {announcement.is_top && (
                          <Badge variant="error" size="sm">置顶</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" icon={<Eye className="h-4 w-4" />}>
                    查看
                  </Button>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {announcement.content}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>
                      {announcement.publish_time
                        ? new Date(announcement.publish_time).toLocaleDateString('zh-CN')
                        : new Date(announcement.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  {announcement.expire_time && (
                    <span className="text-gray-400">
                      有效期至: {new Date(announcement.expire_time).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">没有找到符合条件的公告</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
