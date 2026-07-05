import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Home,
  TrendingUp,
  Wrench,
  DollarSign,
  UserPlus,
  AlertTriangle,
  Search,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import {
  getOccupancyStatistics,
  getRepairStatistics,
  getChargeStatistics,
  getAnnouncements,
} from '@/api';

export const Dashboard: React.FC = () => {
  // 获取入住率统计
  const {
    data: occupancyData,
    isLoading: occupancyLoading,
    error: occupancyError,
    refetch: refetchOccupancy,
  } = useQuery({
    queryKey: ['statistics', 'occupancy'],
    queryFn: getOccupancyStatistics,
  });

  // 获取报修统计
  const {
    data: repairData,
    isLoading: repairLoading,
    error: repairError,
    refetch: refetchRepair,
  } = useQuery({
    queryKey: ['statistics', 'repairs'],
    queryFn: getRepairStatistics,
  });

  // 获取费用统计
  const {
    data: chargeData,
    isLoading: chargeLoading,
    error: chargeError,
    refetch: refetchCharge,
  } = useQuery({
    queryKey: ['statistics', 'charges'],
    queryFn: getChargeStatistics,
  });

  // 获取最新公告
  const {
    data: announcementsData,
    isLoading: announcementsLoading,
  } = useQuery({
    queryKey: ['announcements', 'latest'],
    queryFn: () => getAnnouncements({ page: 1, page_size: 5 }),
  });

  const isLoading = occupancyLoading || repairLoading || chargeLoading;
  const hasError = occupancyError || repairError || chargeError;

  const handleRefresh = () => {
    refetchOccupancy();
    refetchRepair();
    refetchCharge();
  };

  // 统计卡片数据
  const stats = [
    {
      title: '总宿舍数',
      value: occupancyData?.total_dormitories ?? 0,
      icon: Home,
      trend: occupancyData?.available_dormitories ?? 0,
      trendLabel: '可用房间',
      color: 'text-[#1E40AF]',
      bgColor: 'bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]',
      lightBg: 'bg-[#1E40AF]/10',
      percentage: occupancyData?.total_dormitories ? ((occupancyData?.available_dormitories ?? 0) / occupancyData.total_dormitories) * 100 : 0,
    },
    {
      title: '入住率',
      value: `${(occupancyData?.occupancy_rate ?? 0).toFixed(1)}%`,
      icon: TrendingUp,
      trend: occupancyData?.occupied_dormitories ?? 0,
      trendLabel: '已入住房间',
      color: 'text-[#10B981]',
      bgColor: 'bg-gradient-to-br from-[#10B981] to-[#34D399]',
      lightBg: 'bg-[#10B981]/10',
      percentage: occupancyData?.occupancy_rate ?? 0,
    },
    {
      title: '待处理报修',
      value: repairData?.pending_repairs ?? 0,
      icon: Wrench,
      trend: repairData?.in_progress_repairs ?? 0,
      trendLabel: '处理中',
      color: 'text-[#F59E0B]',
      bgColor: 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]',
      lightBg: 'bg-[#F59E0B]/10',
      percentage: repairData?.pending_repairs && repairData?.in_progress_repairs ? ((repairData.pending_repairs / (repairData.pending_repairs + repairData.in_progress_repairs)) * 100) : 0,
    },
    {
      title: '待缴费金额',
      value: `¥${(chargeData?.pending_amount ?? 0).toFixed(2)}`,
      icon: DollarSign,
      trend: chargeData?.overdue_amount ?? 0,
      trendLabel: '已逾期',
      color: 'text-[#EF4444]',
      bgColor: 'bg-gradient-to-br from-[#EF4444] to-[#F87171]',
      lightBg: 'bg-[#EF4444]/10',
      percentage: chargeData?.pending_amount && chargeData?.overdue_amount ? ((chargeData.overdue_amount / chargeData.pending_amount) * 100) : 0,
    },
  ];

  // 快捷操作
  const quickActions = [
    { label: '快速入住', icon: UserPlus, variant: 'primary' as const },
    { label: '快速报修', icon: Wrench, variant: 'secondary' as const },
    { label: '费用查询', icon: Search, variant: 'secondary' as const },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-500 mt-1">欢迎回来，查看最新数据概览</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          刷新数据
        </Button>
      </div>

      {/* 错误提示 */}
      {hasError && (
        <Card shadow="md" className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">部分数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} shadow="lg" className="p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="w-24 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-400">
                        <span className={`font-semibold ${stat.color}`}>{stat.trend}</span> {stat.trendLabel}
                      </p>
                    </>
                  )}
                </div>
                <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
              {/* 进度条 */}
              {!isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>进度</span>
                    <span className={`font-medium ${stat.color}`}>{stat.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${stat.bgColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* 快捷操作与公告 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 快捷操作 */}
        <Card shadow="md" className="border border-gray-100">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-[#1E40AF]" />
              </div>
              快捷操作
            </Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  icon={<Icon className="h-5 w-5" />}
                  className="w-full justify-start hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
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
            {announcementsLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
              </div>
            ) : announcementsData?.items && announcementsData.items.length > 0 ? (
              announcementsData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {item.is_pinned && (
                      <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-pulse" />
                    )}
                    <Badge
                      variant={item.is_pinned ? 'error' : 'default'}
                      size="sm"
                    >
                      {item.is_pinned ? '重要' : '普通'}
                    </Badge>
                    <span className="text-sm text-gray-900 flex-1">{item.title}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(item.published_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无公告
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;