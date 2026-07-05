import React, { useState } from 'react';
import { Plus, Wrench, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

// 模拟报修数据
const mockRepairs = [
  {
    id: '1',
    title: '空调不制冷',
    type: '电器',
    priority: '高',
    status: '待处理',
    location: 'A栋301',
    createdAt: '2024-01-15 10:30',
  },
  {
    id: '2',
    title: '水龙头漏水',
    type: '水管',
    priority: '中',
    status: '已分配',
    location: 'B栋205',
    createdAt: '2024-01-14 15:20',
  },
  {
    id: '3',
    title: '门锁损坏',
    type: '门窗',
    priority: '高',
    status: '处理中',
    location: 'C栋401',
    createdAt: '2024-01-13 09:15',
  },
  {
    id: '4',
    title: '灯泡更换',
    type: '电器',
    priority: '低',
    status: '已完成',
    location: 'D栋102',
    createdAt: '2024-01-12 14:00',
  },
  {
    id: '5',
    title: '窗户玻璃破裂',
    type: '门窗',
    priority: '高',
    status: '已取消',
    location: 'E栋308',
    createdAt: '2024-01-11 11:45',
  },
];

const statusList = ['全部', '待处理', '已分配', '处理中', '已完成', '已取消'];

const statusVariant: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'default'> = {
  '待处理': 'warning',
  '已分配': 'info',
  '处理中': 'primary',
  '已完成': 'success',
  '已取消': 'default',
};

const priorityVariant: Record<string, 'error' | 'warning' | 'default'> = {
  '高': 'error',
  '中': 'warning',
  '低': 'default',
};

export default function Repairs() {
  const [activeStatus, setActiveStatus] = useState('全部');
  const [repairs] = useState(mockRepairs);

  const filteredRepairs =
    activeStatus === '全部'
      ? repairs
      : repairs.filter((repair) => repair.status === activeStatus);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报修中心</h1>
          <p className="text-gray-600 mt-1">管理和处理宿舍报修工单</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} variant="primary">
          新建报修
        </Button>
      </div>

      {/* 状态筛选标签 */}
      <Card shadow="md" padding="md">
        <div className="flex items-center gap-2 flex-wrap">
          {statusList.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeStatus === status
                  ? 'bg-[#1E40AF] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
              {status !== '全部' && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {repairs.filter((r) => r.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* 工单卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRepairs.map((repair) => (
          <Card key={repair.id} shadow="md" padding="none" className="hover:shadow-lg transition-shadow">
            <Card.Header>
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold text-gray-900">{repair.title}</h3>
                <Badge variant={priorityVariant[repair.priority]} size="sm">
                  {repair.priority}
                </Badge>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">故障类型：</span>
                  <span className="text-gray-900 font-medium">{repair.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">报修位置：</span>
                  <span className="text-gray-900 font-medium">{repair.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">报修时间：</span>
                  <span className="text-gray-900">{repair.createdAt}</span>
                </div>
              </div>
            </Card.Content>
            <Card.Footer>
              <div className="flex items-center justify-between">
                <Badge variant={statusVariant[repair.status]} size="sm" dot>
                  {repair.status}
                </Badge>
                <Button size="sm" variant="secondary">
                  查看详情
                </Button>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredRepairs.length === 0 && (
        <Card shadow="md" padding="lg">
          <div className="text-center py-8">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无报修工单</p>
          </div>
        </Card>
      )}
    </div>
  );
}