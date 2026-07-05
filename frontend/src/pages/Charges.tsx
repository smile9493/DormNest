import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Receipt, Zap, Droplets, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getMyCharges } from '@/api';
import type { Charge, ChargeType, ChargeStatus } from '@/types/api';

export default function Charges() {
  const [activeType, setActiveType] = useState<ChargeType | 'all'>('all');

  // 获取费用列表
  const {
    data: chargesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['charges', 'me'],
    queryFn: () => getMyCharges({ page: 1, page_size: 50 }),
  });

  const charges = chargesData?.items || [];

  const filteredCharges =
    activeType === 'all'
      ? charges
      : charges.filter((charge: Charge) => charge.type === activeType);

  const totalAmount = filteredCharges.reduce((sum: number, charge: Charge) => sum + parseFloat(charge.amount as string), 0);

  const chargeTypes: Array<{ label: string; value: ChargeType | 'all'; icon: React.ComponentType<{ className?: string }> }> = [
    { label: '全部', value: 'all', icon: Receipt },
    { label: '住宿费', value: 'accommodation', icon: DollarSign },
    { label: '电费', value: 'electricity', icon: Zap },
    { label: '水费', value: 'water', icon: Droplets },
  ];

  const statusVariant: Record<ChargeStatus, 'success' | 'warning' | 'error'> = {
    'paid': 'success',
    'pending': 'warning',
    'overdue': 'error',
  };

  const statusLabel: Record<ChargeStatus, string> = {
    'paid': '已缴费',
    'pending': '待缴费',
    'overdue': '已逾期',
  };

  const typeLabel: Record<ChargeType, string> = {
    'accommodation': '住宿费',
    'electricity': '电费',
    'water': '水费',
    'other': '其他',
  };

  const typeIcon: Record<ChargeType, React.ComponentType<{ className?: string }> | null> = {
    'accommodation': DollarSign,
    'electricity': Zap,
    'water': Droplets,
    'other': null,
  };

  const typeColor: Record<ChargeType, string> = {
    'accommodation': 'from-[#1E40AF] to-[#3B82F6]',
    'electricity': 'from-[#F59E0B] to-[#FBBF24]',
    'water': 'from-[#10B981] to-[#34D399]',
    'other': 'from-[#6B7280] to-[#9CA3AF]',
  };

  const typeBgColor: Record<ChargeType, string> = {
    'accommodation': 'bg-[#1E40AF]/10',
    'electricity': 'bg-[#F59E0B]/10',
    'water': 'bg-[#10B981]/10',
    'other': 'bg-gray-100',
  };

  const statusColor: Record<ChargeStatus, string> = {
    'paid': 'from-[#10B981] to-[#34D399]',
    'pending': 'from-[#F59E0B] to-[#FBBF24]',
    'overdue': 'from-[#EF4444] to-[#F87171]',
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">费用管理</h1>
          <p className="text-gray-600 mt-1">查看和管理宿舍相关费用</p>
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
          <div className="text-right">
            <p className="text-sm text-gray-600">总金额</p>
            <p className="text-2xl font-bold text-[#1E40AF]">
              ¥{isLoading ? '...' : totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* 费用类型筛选 */}
      <Card shadow="md" padding="md" className="border border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          {chargeTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveType(type.value)}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                activeType === type.value
                  ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1E40AF]/30 hover:shadow-md'
              }`}
            >
              <type.icon className="h-5 w-5" />
              {type.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 费用账单表格 */}
      <Card shadow="lg" className="border border-gray-100">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-[#1E40AF] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-red-300 mx-auto mb-3" />
              <p className="text-red-500">费用数据加载失败，请点击刷新按钮重试</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    费用类型
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    学期
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    缴费状态
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    缴费日期
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCharges.map((charge: Charge, idx: number) => {
                  const Icon = typeIcon[charge.type];
                  return (
                    <tr 
                      key={charge.id} 
                      className={`transition-all duration-200 ${
                        idx % 2 === 0 
                          ? 'bg-white hover:bg-[#1E40AF]/5' 
                          : 'bg-gray-50 hover:bg-[#1E40AF]/5'
                      } hover:shadow-sm`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${typeColor[charge.type]} shadow-md`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-900">
                            {typeLabel[charge.type]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ¥{parseFloat(charge.amount as string).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {charge.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={statusVariant[charge.status]} 
                          size="sm" 
                          dot 
                          className="shadow-sm"
                        >
                          {statusLabel[charge.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {charge.paid_at
                          ? new Date(charge.paid_at).toLocaleDateString('zh-CN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {charge.status !== 'paid' ? (
                          <Button 
                            size="sm" 
                            variant="primary"
                            className="bg-gradient-to-r from-[#10B981] to-[#34D399] hover:shadow-lg transition-all"
                          >
                            立即缴费
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="hover:shadow-md transition-all"
                          >
                            查看详情
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {!isLoading && !error && filteredCharges.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">暂无费用记录</p>
            <p className="text-gray-400 text-sm mt-1">请选择其他费用类型</p>
          </div>
        )}
      </Card>

      {/* 统计卡片 */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card shadow="lg" padding="md" className="border-2 border-gray-100 hover:border-[#10B981]/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">已缴费</p>
                <p className="text-3xl font-bold text-[#10B981]">
                  ¥{charges.filter((c: Charge) => c.status === 'paid').reduce((sum: number, c: Charge) => sum + parseFloat(c.amount as string), 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {charges.filter((c: Charge) => c.status === 'paid').length} 笔
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] shadow-lg">
                <Receipt className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>
          
          <Card shadow="lg" padding="md" className="border-2 border-gray-100 hover:border-[#F59E0B]/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">待缴费</p>
                <p className="text-3xl font-bold text-[#F59E0B]">
                  ¥{charges.filter((c: Charge) => c.status === 'pending').reduce((sum: number, c: Charge) => sum + parseFloat(c.amount as string), 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {charges.filter((c: Charge) => c.status === 'pending').length} 笔
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] shadow-lg">
                <Receipt className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>
          
          <Card shadow="lg" padding="md" className="border-2 border-gray-100 hover:border-[#EF4444]/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">已逾期</p>
                <p className="text-3xl font-bold text-[#EF4444]">
                  ¥{charges.filter((c: Charge) => c.status === 'overdue').reduce((sum: number, c: Charge) => sum + parseFloat(c.amount as string), 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {charges.filter((c: Charge) => c.status === 'overdue').length} 笔
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EF4444] to-[#F87171] shadow-lg">
                <Receipt className="h-7 w-7 text-white" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}