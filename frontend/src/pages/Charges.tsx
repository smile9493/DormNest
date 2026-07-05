import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, Search, RefreshCw, AlertTriangle, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { getMyCharges, payCharge } from '@/api';
import type { Charge, ChargeStatus } from '@/types/api';

export default function Charges() {
  const [filterStatus, setFilterStatus] = useState<ChargeStatus | 'all'>('all');
  const queryClient = useQueryClient();

  // 获取费用列表
  const {
    data: charges,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['charges', filterStatus],
    queryFn: () => getMyCharges(),
  });

  // 缴费
  const payMutation = useMutation({
    mutationFn: (chargeId: number) => payCharge(chargeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charges'] });
    },
  });

  const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
    'unpaid': 'warning',
    'paid': 'success',
    'overdue': 'error',
  };

  const statusLabel: Record<string, string> = {
    'unpaid': '未缴费',
    'paid': '已缴费',
    'overdue': '已逾期',
  };

  const statusIcon: Record<string, React.ReactNode> = {
    'unpaid': <Clock className="h-4 w-4" />,
    'paid': <CheckCircle className="h-4 w-4" />,
    'overdue': <AlertTriangle className="h-4 w-4" />,
  };

  const filteredCharges = charges?.filter((charge: Charge) =>
    filterStatus === 'all' || charge.pay_status === filterStatus
  ) || [];

  const filterButtons = [
    { status: 'all' as const, label: '全部', color: 'bg-[#1E40AF]' },
    { status: 'unpaid' as const, label: '未缴费', color: 'bg-[#F59E0B]' },
    { status: 'paid' as const, label: '已缴费', color: 'bg-[#10B981]' },
    { status: 'overdue' as const, label: '已逾期', color: 'bg-[#EF4444]' },
  ];

  // 统计
  const totalUnpaid = filteredCharges
    .filter((c: Charge) => c.pay_status === 'unpaid')
    .reduce((sum: number, c: Charge) => sum + c.amount, 0);
  const totalOverdue = filteredCharges
    .filter((c: Charge) => c.pay_status === 'overdue')
    .reduce((sum: number, c: Charge) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">费用管理</h1>
          <p className="text-gray-500 mt-1">查看和管理住宿费用</p>
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

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card shadow="md" className="border border-[#F59E0B]/20 bg-gradient-to-br from-[#F59E0B]/5 to-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">待缴费</p>
                <p className="text-2xl font-bold text-[#F59E0B]">¥{totalUnpaid.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F59E0B]/10">
                <Clock className="h-6 w-6 text-[#F59E0B]" />
              </div>
            </div>
          </div>
        </Card>
        <Card shadow="md" className="border border-[#EF4444]/20 bg-gradient-to-br from-[#EF4444]/5 to-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已逾期</p>
                <p className="text-2xl font-bold text-[#EF4444]">¥{totalOverdue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#EF4444]/10">
                <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
              </div>
            </div>
          </div>
        </Card>
        <Card shadow="md" className="border border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/5 to-white">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已缴费</p>
                <p className="text-2xl font-bold text-[#10B981]">
                  ¥{filteredCharges.filter((c: Charge) => c.pay_status === 'paid').reduce((sum: number, c: Charge) => sum + c.amount, 0).toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-[#10B981]/10">
                <CheckCircle className="h-6 w-6 text-[#10B981]" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 筛选区域 */}
      <Card shadow="md" className="border border-gray-100">
        <div className="p-4">
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
      </Card>

      {/* 错误提示 */}
      {error && (
        <Card shadow="md" className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">费用数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* 费用列表 */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredCharges.map((charge: Charge) => (
            <Card key={charge.charge_id} shadow="md" className="border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      charge.pay_status === 'paid' 
                        ? 'bg-[#10B981]/10' 
                        : charge.pay_status === 'overdue' 
                          ? 'bg-[#EF4444]/10' 
                          : 'bg-[#F59E0B]/10'
                    }`}>
                      {statusIcon[charge.pay_status]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {charge.charge_type}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={statusVariant[charge.pay_status]} size="sm">
                          {statusLabel[charge.pay_status]}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          费用日期: {new Date(charge.charge_date).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ¥{charge.amount.toFixed(2)}
                    </span>
                    {(charge.pay_status === 'unpaid' || charge.pay_status === 'overdue') && (
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<CreditCard className="h-4 w-4" />}
                        onClick={() => payMutation.mutate(charge.charge_id)}
                        disabled={payMutation.isPending}
                      >
                        缴费
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {charge.due_date && (
                    <span>截止日期: {new Date(charge.due_date).toLocaleDateString('zh-CN')}</span>
                  )}
                  {charge.pay_date && (
                    <span className="text-[#10B981]">缴费时间: {new Date(charge.pay_date).toLocaleDateString('zh-CN')}</span>
                  )}
                  {charge.pay_method && (
                    <span>缴费方式: {charge.pay_method}</span>
                  )}
                  {charge.memo && (
                    <span>备注: {charge.memo}</span>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredCharges.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">没有找到符合条件的费用记录</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
