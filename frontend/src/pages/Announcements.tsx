import React, { useState } from 'react';
import { Bell, Clock, Pin } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

// 模拟公告数据
const mockAnnouncements = [
  {
    id: '1',
    title: '关于2024年寒假宿舍管理的通知',
    summary: '为确保寒假期间宿舍安全，现将相关事项通知如下：请各位同学在离校前做好宿舍卫生清洁工作，关闭水电门窗，妥善保管贵重物品...',
    content: '完整内容...',
    isPinned: true,
    publishedAt: '2024-01-15 10:00',
    author: '学生处',
  },
  {
    id: '2',
    title: '宿舍楼电梯维护通知',
    summary: '因电梯年度检修需要，A栋电梯将于2024年1月20日进行维护，届时将暂停使用，请同学们提前安排出行计划...',
    content: '完整内容...',
    isPinned: true,
    publishedAt: '2024-01-14 15:30',
    author: '后勤部',
  },
  {
    id: '3',
    title: '关于开展宿舍安全隐患排查的通知',
    summary: '为进一步加强宿舍安全管理，消除安全隐患，学校决定在全校范围内开展宿舍安全隐患排查工作，请各宿舍配合检查...',
    content: '完整内容...',
    isPinned: false,
    publishedAt: '2024-01-13 09:00',
    author: '保卫处',
  },
  {
    id: '4',
    title: '电费缴纳系统升级公告',
    summary: '为提升服务质量，电费缴纳系统将于2024年1月18日进行升级维护，届时将暂停缴费服务，请同学们提前充值...',
    content: '完整内容...',
    isPinned: false,
    publishedAt: '2024-01-12 14:20',
    author: '信息中心',
  },
  {
    id: '5',
    title: '宿舍文化节活动通知',
    summary: '为丰富学生宿舍文化生活，学校决定举办第三届宿舍文化节，欢迎各宿舍积极报名参加，展示宿舍风采...',
    content: '完整内容...',
    isPinned: false,
    publishedAt: '2024-01-11 16:00',
    author: '学生会',
  },
];

export default function Announcements() {
  const [announcements] = useState(mockAnnouncements);

  // 按置顶和时间排序
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公告通知</h1>
          <p className="text-gray-600 mt-1">查看最新宿舍公告和通知信息</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Bell className="h-4 w-4" />
          <span>共 {announcements.length} 条公告</span>
        </div>
      </div>

      {/* 公告卡片列表 */}
      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            shadow="md"
            padding="none"
            className="hover:shadow-lg transition-all cursor-pointer"
          >
            <Card.Content className="py-4">
              <div className="flex items-start gap-4">
                {/* 置顶图标 */}
                {announcement.isPinned && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-[#EF4444]/10 rounded-full p-2">
                      <Pin className="h-4 w-4 text-[#EF4444]" />
                    </div>
                  </div>
                )}

                {/* 公告内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-[#1E40AF] transition-colors">
                          {announcement.title}
                        </h3>
                        {announcement.isPinned && (
                          <Badge variant="error" size="sm">
                            置顶
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {announcement.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{announcement.publishedAt}</span>
                        </div>
                        <span>发布者：{announcement.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {announcements.length === 0 && (
        <Card shadow="md" padding="lg">
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无公告通知</p>
          </div>
        </Card>
      )}

      {/* 公告统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card shadow="md" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">置顶公告</p>
              <p className="text-2xl font-bold text-[#EF4444]">
                {announcements.filter((a) => a.isPinned).length}
              </p>
            </div>
            <div className="bg-[#EF4444]/10 rounded-full p-3">
              <Pin className="h-6 w-6 text-[#EF4444]" />
            </div>
          </div>
        </Card>
        <Card shadow="md" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">本周公告</p>
              <p className="text-2xl font-bold text-[#1E40AF]">
                {announcements.filter((a) => {
                  const publishedDate = new Date(a.publishedAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return publishedDate >= weekAgo;
                }).length}
              </p>
            </div>
            <div className="bg-[#1E40AF]/10 rounded-full p-3">
              <Bell className="h-6 w-6 text-[#1E40AF]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}