import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Wrench, Clock, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { getRepairs } from '@/api';
import type { Repair, RepairStatus } from '@/types/api';

export default function Repairs() {
  const [activeStatus, setActiveStatus] = useState<RepairStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [newRepairForm, setNewRepairForm] = useState({
    title: '',
    type: 'electrical',
    priority: 'medium',
    location: '',
    description: '',
  });
  const [updateNote, setUpdateNote] = useState('');

  // 获取报修工单列表
  const {
    data: repairsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['repairs', activeStatus],
    queryFn: () => getRepairs(
      activeStatus === 'all' ? undefined : activeStatus,
      { page: 1, page_size: 50 }
    ),
  });

  const repairs = repairsData?.items || [];

  const statusList: Array<{ status: RepairStatus | 'all'; label: string }> = [
    { status: 'all', label: '全部' },
    { status: 'pending', label: '待处理' },
    { status: 'assigned', label: '已分配' },
    { status: 'in_progress', label: '处理中' },
    { status: 'completed', label: '已完成' },
    { status: 'cancelled', label: '已取消' },
  ];

  const statusVariant: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'default'> = {
    'pending': 'warning',
    'assigned': 'info',
    'in_progress': 'primary',
    'completed': 'success',
    'cancelled': 'default',
  };

  const statusLabel: Record<string, string> = {
    'pending': '待处理',
    'assigned': '已分配',
    'in_progress': '处理中',
    'completed': '已完成',
    'cancelled': '已取消',
  };

  const priorityVariant: Record<string, 'error' | 'warning' | 'default'> = {
    'high': 'error',
    'medium': 'warning',
    'low': 'default',
  };

  const priorityLabel: Record<string, string> = {
    'high': '高',
    'medium': '中',
    'low': '低',
  };

  const priorityColor: Record<string, string> = {
    'high': 'from-[#EF4444] to-[#F87171]',
    'medium': 'from-[#F59E0B] to-[#FBBF24]',
    'low': 'from-[#10B981] to-[#34D399]',
  };

  const priorityBgColor: Record<string, string> = {
    'high': 'bg-[#EF4444]/10',
    'medium': 'bg-[#F59E0B]/10',
    'low': 'bg-[#10B981]/10',
  };

  const statusColor: Record<string, string> = {
    'pending': 'from-[#F59E0B] to-[#FBBF24]',
    'assigned': 'from-[#6366F1] to-[#818CF8]',
    'in_progress': 'from-[#1E40AF] to-[#3B82F6]',
    'completed': 'from-[#10B981] to-[#34D399]',
    'cancelled': 'from-[#6B7280] to-[#9CA3AF]',
  };

  const handleRefresh = () => {
    refetch();
  };

  // 新建报修工单
  const handleCreateRepair = () => {
    // 这里应该调用 API 创建工单
    // 暂时只是关闭模态框并显示提示
    console.log('新建报修工单:', newRepairForm);
    setShowCreateModal(false);
    setNewRepairForm({
      title: '',
      type: 'electrical',
      priority: 'medium',
      location: '',
      description: '',
    });
    refetch();
  };

  // 更新工单状态
  const handleUpdateStatus = (newStatus: RepairStatus) => {
    // 这里应该调用 API 更新工单状态
    // 暂时只是关闭模态框并显示提示
    console.log('更新工单状态:', { repairId: selectedRepair?.id, newStatus, note: updateNote });
    setShowUpdateModal(false);
    setSelectedRepair(null);
    setUpdateNote('');
    refetch();
  };

  // 查看工单详情并允许更新状态
  const handleViewRepair = (repair: Repair) => {
    setSelectedRepair(repair);
    setShowUpdateModal(true);
  };

  const repairTypes = [
    { value: 'electrical', label: '电气故障' },
    { value: 'plumbing', label: '水暖故障' },
    { value: 'furniture', label: '家具损坏' },
    { value: 'network', label: '网络问题' },
    { value: 'other', label: '其他问题' },
  ];

  const priorityOptions = [
    { value: 'low', label: '低' },
    { value: 'medium', label: '中' },
    { value: 'high', label: '高' },
  ];

  const nextStatusOptions: Record<RepairStatus, RepairStatus[]> = {
    'pending': ['assigned'],
    'assigned': ['in_progress'],
    'in_progress': ['completed'],
    'completed': [],
    'cancelled': [],
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报修中心</h1>
          <p className="text-gray-600 mt-1">管理和处理宿舍报修工单</p>
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
          <Button 
            icon={<Plus className="h-4 w-4" />} 
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            新建报修
          </Button>
        </div>
      </div>

      {/* 状态筛选标签 */}
      <Card shadow="md" padding="md" className="border border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          {statusList.map((item) => (
            <button
              key={item.status}
              onClick={() => setActiveStatus(item.status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                activeStatus === item.status
                  ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1E40AF]/30 hover:shadow-md'
              }`}
            >
              {item.label}
              {item.status !== 'all' && repairsData && (
                <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeStatus === item.status 
                    ? 'bg-white/30 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {repairs.filter((r: Repair) => r.status === item.status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* 工单卡片列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : error ? (
        <Card shadow="md" className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <Wrench className="h-5 w-5" />
            <p className="text-sm">报修数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repairs.map((repair: Repair) => (
            <Card 
              key={repair.id} 
              shadow="lg" 
              padding="none" 
              className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-[#1E40AF]/20 overflow-hidden"
            >
              {/* 优先级标识条 */}
              <div className={`h-2 bg-gradient-to-r ${priorityColor[repair.priority]}`}></div>
              
              <Card.Header className="bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-start justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${statusColor[repair.status]} shadow-lg`}>
                      <Wrench className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{repair.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={priorityVariant[repair.priority]} size="sm" className="shadow-sm">
                          {priorityLabel[repair.priority]}优先级
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Content className="py-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#1E40AF]/5 transition-colors">
                    <div className="p-2 rounded-lg bg-[#1E40AF]/10">
                      <Wrench className="h-4 w-4 text-[#1E40AF]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500">故障类型</span>
                      <p className="text-sm font-semibold text-gray-900">{repair.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#F59E0B]/5 transition-colors">
                    <div className="p-2 rounded-lg bg-[#F59E0B]/10">
                      <AlertCircle className="h-4 w-4 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500">报修位置</span>
                      <p className="text-sm font-semibold text-gray-900">{repair.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-[#10B981]/5 transition-colors">
                    <div className="p-2 rounded-lg bg-[#10B981]/10">
                      <Clock className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-gray-500">报修时间</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(repair.created_at).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Content>
              
              <Card.Footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
                <div className="flex items-center justify-between py-3">
                  <Badge variant={statusVariant[repair.status]} size="sm" dot className="shadow-sm">
                    {statusLabel[repair.status]}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="primary" 
                    className="hover:shadow-lg transition-all"
                    onClick={() => handleViewRepair(repair)}
                  >
                    查看详情
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && !error && repairs.length === 0 && (
        <Card shadow="md" padding="lg">
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无报修工单</p>
          </div>
        </Card>
      )}

      {/* 新建报修工单模态框 */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="新建报修工单"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="工单标题"
            placeholder="请输入工单标题"
            value={newRepairForm.title}
            onChange={(e) => setNewRepairForm({ ...newRepairForm, title: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              故障类型
            </label>
            <select
              value={newRepairForm.type}
              onChange={(e) => setNewRepairForm({ ...newRepairForm, type: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white"
            >
              {repairTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              优先级
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setNewRepairForm({ ...newRepairForm, priority: option.value })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    newRepairForm.priority === option.value
                      ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1E40AF]/30'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <Input
            label="报修位置"
            placeholder="例如: A栋 3楼 301室"
            value={newRepairForm.location}
            onChange={(e) => setNewRepairForm({ ...newRepairForm, location: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              详细描述
            </label>
            <textarea
              placeholder="请详细描述故障情况..."
              value={newRepairForm.description}
              onChange={(e) => setNewRepairForm({ ...newRepairForm, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCreateModal(false)}
            >
              取消
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleCreateRepair}
              disabled={!newRepairForm.title || !newRepairForm.location}
            >
              提交工单
            </Button>
          </div>
        </div>
      </Modal>

      {/* 工单详情和状态更新模态框 */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedRepair(null);
          setUpdateNote('');
        }}
        title="工单详情"
        size="lg"
      >
        {selectedRepair && (
          <div className="space-y-4">
            {/* 工单基本信息 */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{selectedRepair.title}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">故障类型:</span>
                  <span className="font-semibold text-gray-900">{selectedRepair.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">优先级:</span>
                  <Badge variant={priorityVariant[selectedRepair.priority]} size="sm">
                    {priorityLabel[selectedRepair.priority]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">报修位置:</span>
                  <span className="font-semibold text-gray-900">{selectedRepair.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">当前状态:</span>
                  <Badge variant={statusVariant[selectedRepair.status]} size="sm" dot>
                    {statusLabel[selectedRepair.status]}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* 详细描述 */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">详细描述</h4>
              <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                {selectedRepair.description}
              </p>
            </div>
            
            {/* 时间信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1E40AF]/10">
                <Clock className="h-4 w-4 text-[#1E40AF]" />
                <span className="font-medium text-[#1E40AF]">
                  创建: {new Date(selectedRepair.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#10B981]/10">
                <Clock className="h-4 w-4 text-[#10B981]" />
                <span className="font-medium text-[#10B981]">
                  更新: {new Date(selectedRepair.updated_at).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
            
            {/* 状态更新区域（仅维修员） */}
            {nextStatusOptions[selectedRepair.status].length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">更新工单状态</h4>
                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-2">处理备注</label>
                  <textarea
                    placeholder="请输入处理备注..."
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  {nextStatusOptions[selectedRepair.status].map((nextStatus) => (
                    <Button
                      key={nextStatus}
                      variant="primary"
                      icon={<CheckCircle2 className="h-4 w-4" />}
                      onClick={() => handleUpdateStatus(nextStatus)}
                      className="hover:shadow-lg transition-all"
                    >
                      更新为 {statusLabel[nextStatus]}
                    </Button>
                  ))}
                  {selectedRepair.status !== 'cancelled' && (
                    <Button
                      variant="error"
                      onClick={() => handleUpdateStatus('cancelled')}
                      className="hover:shadow-lg transition-all"
                    >
                      取消工单
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* 已完成或已取消的工单提示 */}
            {(selectedRepair.status === 'completed' || selectedRepair.status === 'cancelled') && (
              <div className="p-4 bg-gradient-to-r from-[#10B981]/10 to-[#34D399]/10 rounded-lg border-2 border-[#10B981]/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                  <span className="text-sm font-semibold text-[#10B981]">
                    该工单已 {statusLabel[selectedRepair.status]}，无法继续更新
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}