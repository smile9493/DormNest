import React, { useState } from 'react';
import { DollarSign, Receipt, Zap, Droplets } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// 模拟费用数据
const mockCharges = [
  {
    id: '1',
    type: '住宿费',
    amount: 1200,
    status: '已缴费',
    paidAt: '2024-01-10',
    semester: '2024春季',
  },
  {
    id: '2',
    type: '电费',
    amount: 85.5,
    status: '待缴费',
    paidAt: '-',
    semester: '2024春季',
  },
  {
    id: '3',
    type: '水费',
    amount: 42.3,
    status: '已缴费',
    paidAt: '2024-01-08',
    semester: '2024春季',
  },
  {
    id: '4',
    type: '住宿费',
    amount: 1200,
    status: '已缴费',
    paidAt: '2023-09-05',
    semester: '2023秋季',
  },
  {
    id: '5',
    type: '电费',
    amount: 120.8,
    status: '已缴费',
    paidAt: '2023-12-20',
    semester: '2023秋季',
  },
  {
    id: '6',
    type: '水费',
    amount: 35.6,
    status: '已逾期',
    paidAt: '-',
    semester: '2023秋季',
  },
];

const chargeTypes = [
  { label: '全部', value: '全部', icon: Receipt },
  { label: '住宿费', value: '住宿费', icon: DollarSign },
  { label: '电费', value: '电费', icon: Zap },
  { label: '水费', value: '水费', icon: Droplets },
];

const statusVariant: Record<string, 'success' | 'warning' | 'error'> = {
  '已缴费': 'success',
  '待缴费': 'warning',
  '已逾期': 'error',
};

export default function Charges() {
  const [activeType, setActiveType] = useState('全部');
  const [charges] = useState(mockCharges);

  const filteredCharges =
    activeType === '全部'
      ? charges
      : charges.filter((charge) => charge.type === activeType);

  const totalAmount = filteredCharges.reduce((sum, charge) => sum + charge.amount, 0);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">费用管理</h1>
          <p className="text-gray-600 mt-1">查看和管理宿舍相关费用</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">总金额</p>
          <p className="text-2xl font-bold text-[#1E40AF]">¥{totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* 费用类型筛选 */}
      <Card shadow="md" padding="md">
        <div className="flex items-center gap-2 flex-wrap">
          {chargeTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveType(type.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeType === type.value
                  ? 'bg-[#1E40AF] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 费用账单表格 */}
      <Card shadow="lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  费用类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  学期
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  缴费状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  缴费日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCharges.map((charge) => (
                <tr key={charge.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {charge.type === '住宿费' && <DollarSign className="h-4 w-4 text-gray-600" />}
                      {charge.type === '电费' && <Zap className="h-4 w-4 text-yellow-500" />}
                      {charge.type === '水费' && <Droplets className="h-4 w-4 text-blue-500" />}
                      <span className="text-sm font-medium text-gray-900">{charge.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ¥{charge.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {charge.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusVariant[charge.status]} size="sm" dot>
                      {charge.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {charge.paidAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {charge.status !== '已缴费' ? (
                      <Button size="sm" variant="primary">
                        立即缴费
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary">
                        查看详情
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCharges.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            暂无费用记录
          </div>
        )}
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card shadow="md" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已缴费</p>
              <p className="text-2xl font-bold text-[#10B981]">
                ¥{charges.filter((c) => c.status === '已缴费').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-[#10B981]/10 rounded-full p-3">
              <Receipt className="h-6 w-6 text-[#10B981]" />
            </div>
          </div>
        </Card>
        <Card shadow="md" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">待缴费</p>
              <p className="text-2xl font-bold text-[#F59E0B]">
                ¥{charges.filter((c) => c.status === '待缴费').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-[#F59E0B]/10 rounded-full p-3">
              <Receipt className="h-6 w-6 text-[#F59E0B]" />
            </div>
          </div>
        </Card>
        <Card shadow="md" padding="md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已逾期</p>
              <p className="text-2xl font-bold text-[#EF4444]">
                ¥{charges.filter((c) => c.status === '已逾期').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-[#EF4444]/10 rounded-full p-3">
              <Receipt className="h-6 w-6 text-[#EF4444]" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}