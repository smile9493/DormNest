import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronRight, Users, DoorOpen, Bed } from 'lucide-react';
import { Card, Badge, Input } from '../components/ui';

// 模拟楼栋数据
const buildings = [
  { id: 1, name: '1号楼', totalRooms: 80, availableRooms: 12, status: 'available' as const, floors: 6 },
  { id: 2, name: '2号楼', totalRooms: 64, availableRooms: 0, status: 'full' as const, floors: 4 },
  { id: 3, name: '3号楼', totalRooms: 80, availableRooms: 8, status: 'available' as const, floors: 6 },
  { id: 4, name: '4号楼', totalRooms: 48, availableRooms: 0, status: 'maintenance' as const, floors: 3 },
  { id: 5, name: '5号楼', totalRooms: 96, availableRooms: 24, status: 'available' as const, floors: 8 },
  { id: 6, name: '6号楼', totalRooms: 72, availableRooms: 3, status: 'available' as const, floors: 5 },
];

// 模拟房间数据
const roomsData: Record<number, Array<{ id: number; number: string; status: 'available' | 'occupied' | 'maintenance'; occupants: number; capacity: number }>> = {
  1: [
    { id: 101, number: '101', status: 'occupied', occupants: 4, capacity: 4 },
    { id: 102, number: '102', status: 'available', occupants: 0, capacity: 4 },
    { id: 103, number: '103', status: 'occupied', occupants: 3, capacity: 4 },
    { id: 104, number: '104', status: 'occupied', occupants: 4, capacity: 4 },
  ],
  2: [
    { id: 201, number: '201', status: 'occupied', occupants: 4, capacity: 4 },
    { id: 202, number: '202', status: 'occupied', occupants: 4, capacity: 4 },
  ],
  3: [
    { id: 301, number: '301', status: 'available', occupants: 0, capacity: 4 },
    { id: 302, number: '302', status: 'occupied', occupants: 4, capacity: 4 },
  ],
  4: [{ id: 401, number: '401', status: 'maintenance', occupants: 0, capacity: 4 }],
  5: [
    { id: 501, number: '501', status: 'available', occupants: 0, capacity: 4 },
    { id: 502, number: '502', status: 'available', occupants: 2, capacity: 4 },
  ],
  6: [
    { id: 601, number: '601', status: 'available', occupants: 1, capacity: 4 },
    { id: 602, number: '602', status: 'occupied', occupants: 4, capacity: 4 },
  ],
};

type FilterStatus = 'all' | 'available' | 'full' | 'maintenance';

export const Dormitories: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBuildings = buildings.filter((b) => filterStatus === 'all' || b.status === filterStatus);
  const getEmptyRate = (available: number, total: number) => ((available / total) * 100).toFixed(1);

  const getStatusBadge = (status: 'available' | 'full' | 'maintenance') => {
    const config = { available: { variant: 'success' as const, label: '可用' }, full: { variant: 'error' as const, label: '已满' }, maintenance: { variant: 'warning' as const, label: '维修中' } };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const getRoomStatusBadge = (status: 'available' | 'occupied' | 'maintenance') => {
    const config = { available: { variant: 'success' as const, label: '空闲' }, occupied: { variant: 'primary' as const, label: '已入住' }, maintenance: { variant: 'warning' as const, label: '维修中' } };
    return <Badge variant={config[status].variant} size="sm">{config[status].label}</Badge>;
  };

  const filterButtons = [
    { status: 'all' as const, label: '全部', color: 'bg-[#1E40AF]' },
    { status: 'available' as const, label: '可用', color: 'bg-[#10B981]' },
    { status: 'full' as const, label: '已满', color: 'bg-[#EF4444]' },
    { status: 'maintenance' as const, label: '维修中', color: 'bg-[#F59E0B]' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">宿舍管理</h1>
        <p className="text-gray-500 mt-1">管理楼栋和房间信息</p>
      </div>

      {/* 筛选区域 */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-64">
          <Input placeholder="搜索楼栋名称..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.status}
              onClick={() => setFilterStatus(btn.status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === btn.status ? `${btn.color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 楼栋网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuildings.map((building) => {
          const isExpanded = selectedBuilding === building.id;
          const rooms = roomsData[building.id] || [];

          return (
            <div key={building.id} className="space-y-2">
              <Card shadow="md" className={`cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-[#1E40AF]' : ''}`}>
                <div className="p-4" onClick={() => setSelectedBuilding(isExpanded ? null : building.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#1E40AF]" />
                      <span className="font-semibold text-gray-900">{building.name}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500">总房间</p>
                      <p className="text-lg font-bold text-gray-900">{building.totalRooms}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#1E40AF]/10">
                      <p className="text-xs text-gray-500">空房</p>
                      <p className="text-lg font-bold text-[#1E40AF]">{building.availableRooms}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500">空房率</p>
                      <p className="text-lg font-bold text-gray-900">{getEmptyRate(building.availableRooms, building.totalRooms)}%</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{building.floors}层</span>
                    {getStatusBadge(building.status)}
                  </div>
                </div>
              </Card>

              {isExpanded && rooms.length > 0 && (
                <Card shadow="sm" className="bg-gray-50">
                  <div className="p-3 space-y-2">
                    {rooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-2 bg-white rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3">
                          <DoorOpen className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{room.number}</span>
                          {getRoomStatusBadge(room.status)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="h-3 w-3" />
                          <span>{room.occupants}/{room.capacity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      {filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <Bed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">没有找到符合条件的楼栋</p>
        </div>
      )}
    </div>
  );
};

export default Dormitories;