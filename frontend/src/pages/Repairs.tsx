import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrench, Search, Filter, Plus, Eye, RefreshCw, AlertTriangle, Clock, CheckCircle, XCircle, User, Building2 } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { getRepairs, createRepair, updateRepairStatus } from '@/api';
import type { Repair, RepairStatus, RepairCreateRequest } from '@/types/api';

export default function Repairs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<RepairStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  // 获取报修工单列表
  const {
    data: repairs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['repairs', filterStatus],
    queryFn: () => getRepairs(filterStatus === 'all' ? undefined : filterStatus),
  });

  // 创建报修工单
  const createMutation = useMutation({
    mutationFn: createRepair,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      setShowCreateModal(false);
    },
  });

  // 更新报修工单状态
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof updateRepairStatus>[1] }) =>
      updateRepairStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
    },
  });

  const statusVariant: Record<string, 'default' | 'primary' | 'warning' | 'success' | 'error'> = {
    'pending': 'warning',
    'assigned': 'primary',
    'processing': 'primary',
    'completed': 'success',
    'cancelled': 'error',
  };

  const statusLabel: Record<string, string> = {
    'pending': '待处理',
    'assigned': '已分配',
    'processing': '处理中',
    'completed': '已完成',
    'cancelled': '已取消',
  };

  const statusIcon: Record<string, React.ReactNode> = {
    'pending': <Clock className="h-4 w-4" />,
    'assigned': <User className="h-4 w-4" />,
    'processing': <Wrench className="h-4 w-4" />,
    'completed': <CheckCircle className="h-4 w-4" />,
    'cancelled': <XCircle className="h-4 w-4" />,
  };

  const priorityVariant: Record<string, 'default' | 'primary' | 'warning' | 'error'> = {
    'low': 'default',
    'medium': 'primary',
    'high': 'warning',
    'urgent': 'error',
  };

  const priorityLabel: Record<string, string> = {
    'low': '低',
    'medium': '中',
    'high': '高',
    'urgent': '紧急',
  };

  const filteredRepairs = repairs?.filter((repair: Repair) =>
    searchTerm === '' ||
    repair.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.student_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filterButtons = [
    { status: 'all' as const, label: '全部', color: 'bg-[#1E40AF]' },
    { status: 'pending' as const, label: '待处理', color: 'bg-[#F59E0B]' },
    { status: 'processing' as const, label: '处理中', color: 'bg-[#3B82F6]' },
    { status: 'completed' as const, label: '已完成', color: 'bg-[#10B981]' },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报修中心</h1>
          <p className="text-gray-500 mt-1">管理宿舍报修工单</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            刷新数据
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setShowCreateModal(true)}
          >
            新建工单
          </Button>
        </div>
      </div>

      {/* 筛选区域 */}
      <Card shadow="md" className="border border-gray-100">
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="w-64">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1E40AF] transition-colors" />
                <input
                  type="text"
                  placeholder="搜索标题、房间号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white hover:bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map((btn) => (
                <button
                  key={btn.status}
                  onClick={() => setFilterStatus(btn.status)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    filterStatus === btn.status
                      ? `${btn.color} text-white shadow-lg transform scale-105`
                      : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {btn.label}
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
            <p className="text-sm">报修数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* 工单列表 */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredRepairs.map((repair: Repair) => (
            <Card key={repair.repair_id} shadow="md" className="border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      repair.status === 'completed' 
                        ? 'bg-[#10B981]/10' 
                        : repair.status === 'processing' 
                          ? 'bg-[#3B82F6]/10' 
                          : 'bg-[#F59E0B]/10'
                    }`}>
                      {statusIcon[repair.status]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {repair.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {repair.category && (
                          <Badge variant="default" size="sm">{repair.category}</Badge>
                        )}
                        <Badge variant={priorityVariant[repair.priority]} size="sm">
                          {priorityLabel[repair.priority]}
                        </Badge>
                        <Badge variant={statusVariant[repair.status]} size="sm">
                          {statusLabel[repair.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" icon={<Eye className="h-4 w-4" />}>
                      详情
                    </Button>
                    {repair.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => updateMutation.mutate({ id: repair.repair_id, data: { status: 'processing' } })}
                        disabled={updateMutation.isPending}
                      >
                        接单
                      </Button>
                    )}
                    {repair.status === 'processing' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => updateMutation.mutate({ id: repair.repair_id, data: { status: 'completed' } })}
                        disabled={updateMutation.isPending}
                      >
                        完成
                      </Button>
                    )}
                  </div>
                </div>

                {repair.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {repair.description}
                  </p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{repair.student_name || `学生ID:${repair.student_id}`}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    <span>{repair.building_name && repair.room_number ? `${repair.building_name} ${repair.room_number}` : `宿舍ID:${repair.dorm_id}`}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(repair.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                  {repair.completed_at && (
                    <div className="flex items-center gap-1.5 text-[#10B981]">
                      <CheckCircle className="h-4 w-4" />
                      <span>完成于 {new Date(repair.completed_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredRepairs.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">没有找到符合条件的报修工单</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
