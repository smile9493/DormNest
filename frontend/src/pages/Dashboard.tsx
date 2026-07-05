import React from 'react';
import {
  Home,
  TrendingUp,
  Wrench,
  DollarSign,
  UserPlus,
  AlertTriangle,
  Search,
  Bell,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';

// 模拟统计数据
const stats = [
  {
    title: '总宿舍数',
    value: '320',
    icon: Home,
    trend: '+12',
    trendLabel: '较上月',
    color: 'text-[#1E40AF]',
    bgColor: 'bg-[#1E40AF]/10',
  },
  {
    title: '入住率',
    value: '87.5%',
    icon: TrendingUp,
    trend: '+2.3%',
    trendLabel: '较上月',
    color: 'text-[#10B981]',
    bgColor: 'bg-[#10B981]/10',
  },
  {
    title: '待处理报修',
    value: '23',
    icon: Wrench,
    trend: '-5',
    trendLabel: '较昨日',
    color: 'text-[#F59E0B]',
    bgColor: 'bg-[#F59E0B]/10',
  },
  {
    title: '待缴费金额',
    value: '¥45,680',
    icon: DollarSign,
    trend: '+¥3,200',
    trendLabel: '本月新增',
    color: 'text-[#EF4444]',
    bgColor: 'bg-[#EF4444]/10',
  },
];

// 模拟快捷操作
const quickActions = [
  { label: '快速入住', icon: UserPlus, variant: 'primary' as const },
  { label: '快速报修', icon: Wrench, variant: 'secondary' as const },
  { label: '费用查询', icon: Search, variant: 'secondary' as const },
];

// 模拟公告数据
const announcements = [
  {
    id: 1,
    title: '关于宿舍电费缴纳通知',
    date: '2024-01-15',
    type: 'important' as const,
    isNew: true,
  },
  {
    id: 2,
    title: '寒假宿舍安全检查通知',
    date: '2024-01-12',
    type: 'normal' as const,
    isNew: false,
  },
  {
    id: 3,
    title: '1号楼电梯维护公告',
    date: '2024-01-10',
    type: 'warning' as const,
    isNew: false,
  },
  {
    id: 4,
    title: '宿舍门禁系统升级通知',
    date: '2024-01-08',
    type: 'normal' as const,
    isNew: false,
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500 mt-1">欢迎回来，查看最新数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} shadow="lg" className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    <span className={stat.color}>{stat.trend}</span> {stat.trendLabel}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 快捷操作与公告 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快捷操作 */}
        <Card shadow="md">
          <Card.Header>
            <Card.Title>快捷操作</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  icon={<Icon className="h-4 w-4" />}
                  className="w-full justify-start"
                >
                  {action.label}
                </Button>
              );
            })}
          </Card.Content>
        </Card>

        {/* 最新公告 */}
        <Card shadow="md" className="lg:col-span-2">
          <Card.Header className="flex flex-row items-center justify-between">
            <Card.Title className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#1E40AF]" />
              最新公告
            </Card.Title>
            <Button variant="secondary" size="sm">
              查看全部
            </Button>
          </Card.Header>
          <Card.Content className="space-y-3">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.isNew && (
                    <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse" />
                  )}
                  <Badge
                    variant={
                      item.type === 'important'
                        ? 'error'
                        : item.type === 'warning'
                        ? 'warning'
                        : 'default'
                    }
                    size="sm"
                  >
                    {item.type === 'important' ? '重要' : item.type === 'warning' ? '警告' : '普通'}
                  </Badge>
                  <span className="text-sm text-gray-900 flex-1">{item.title}</span>
                </div>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;