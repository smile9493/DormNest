import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, ChevronDown, ChevronRight, Users, DoorOpen, Bed, RefreshCw, Search } from 'lucide-react';
import { Card, Badge, Input, Button } from '../components/ui';
import { getBuildings, getDormitories } from '@/api';
import type { Building, Dormitory, DormitoryStatus } from '@/types/api';

export const Dormitories: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<DormitoryStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 获取楼栋列表
  const {
    data: buildings,
    isLoading: buildingsLoading,
    error: buildingsError,
    refetch: refetchBuildings,
  } = useQuery({
    queryKey: ['buildings'],
    queryFn: getBuildings,
  });

  // 获取宿舍列表
  const {
    data: dormitories,
    isLoading: dormitoriesLoading,
    refetch: refetchDormitories,
  } = useQuery({
    queryKey: ['dormitories', selectedBuilding, filterStatus],
    queryFn: () => getDormitories(
      selectedBuilding,
      filterStatus === 'all' ? undefined : filterStatus
    ),
    enabled: !!selectedBuilding,
  });

  const isLoading = buildingsLoading || dormitoriesLoading;

  // 根据楼栋计算统计信息
  const getBuildingStats = (buildingId: number) => {
    const buildingDormitories = dormitories?.filter(d => d.build_id === buildingId) || [];
    const totalRooms = buildingDormitories.length;
    const availableRooms = buildingDormitories.filter(d => d.status === 'available').length;
    const fullRooms = buildingDormitories.filter(d => d.status === 'full').length;
    const maintenanceRooms = buildingDormitories.filter(d => d.status === 'maintenance').length;

    return { totalRooms, availableRooms, fullRooms, maintenanceRooms };
  };

  // 确定楼栋状态
  const getBuildingStatus = (buildingId: number): 'available' | 'full' | 'maintenance' => {
    const stats = getBuildingStats(buildingId);
    if (stats.maintenanceRooms > 0 && stats.maintenanceRooms === stats.totalRooms) {
      return 'maintenance';
    }
    if (stats.availableRooms === 0) {
      return 'full';
    }
    return 'available';
  };

  const filteredBuildings = buildings?.filter((b: Building) =>
    searchTerm === '' || b.build_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getEmptyRate = (available: number, total: number) => ((available / total) * 100).toFixed(1);

  const getStatusBadge = (status: 'available' | 'full' | 'maintenance') => {
    const config = {
      available: { variant: 'success' as const, label: '可用' },
      full: { variant: 'error' as const, label: '已满' },
      maintenance: { variant: 'warning' as const, label: '维修中' }
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const getRoomStatusBadge = (status: DormitoryStatus) => {
    const config = {
      available: { variant: 'success' as const, label: '空闲' },
      full: { variant: 'primary' as const, label: '已满' },
      maintenance: { variant: 'warning' as const, label: '维修中' }
    };
    return <Badge variant={config[status].variant} size="sm">{config[status].label}</Badge>;
  };

  const filterButtons = [
    { status: 'all' as const, label: '全部', color: 'bg-[#1E40AF]' },
    { status: 'available' as const, label: '可用', color: 'bg-[#10B981]' },
    { status: 'full' as const, label: '已满', color: 'bg-[#EF4444]' },
    { status: 'maintenance' as const, label: '维修中', color: 'bg-[#F59E0B]' },
  ];

  const handleRefresh = () => {
    refetchBuildings();
    if (selectedBuilding) {
      refetchDormitories();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">宿舍管理</h1>
          <p className="text-gray-500 mt-1">管理楼栋和房间信息</p>
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

      {/* 筛选区域 */}
      <Card shadow="md" className="border border-gray-100">
        <div className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="w-64">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1E40AF] transition-colors" />
                <input
                  type="text"
                  placeholder="搜索楼栋名称..."
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
      {buildingsError && (
        <Card shadow="md" className="bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <Bed className="h-5 w-5" />
            <p className="text-sm">楼栋数据加载失败，请点击刷新按钮重试</p>
          </div>
        </Card>
      )}

      {/* 加载状态 */}
      {buildingsLoading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* 楼栋网格 */}
      {!buildingsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuildings.map((building: Building) => {
            const isExpanded = selectedBuilding === building.build_id;
            const stats = getBuildingStats(building.build_id);
            const buildingStatus = getBuildingStatus(building.build_id);
            const buildingDormitories = dormitories?.filter(d => d.build_id === building.build_id) || [];

            return (
              <div key={building.build_id} className="space-y-2">
                <Card
                  shadow="lg"
                  className={`cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border-2 ${
                    isExpanded 
                      ? 'ring-2 ring-[#1E40AF] border-[#1E40AF] bg-gradient-to-br from-[#1E40AF]/5 to-[#3B82F6]/5' 
                      : 'border-gray-100 hover:border-[#1E40AF]/30'
                  }`}
                >
                  <div
                    className="p-5"
                    onClick={() => setSelectedBuilding(isExpanded ? null : building.build_id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl transition-transform duration-300 ${
                          isExpanded 
                            ? 'bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] transform rotate-12' 
                            : 'bg-[#1E40AF]/10 hover:bg-[#1E40AF]/20'
                        }`}>
                          <Building2 className={`h-6 w-6 transition-colors ${
                            isExpanded ? 'text-white' : 'text-[#1E40AF]'
                          }`} />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg">
                            {building.build_name}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {building.dorm_floor}层 · {stats.totalRooms}个房间
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(buildingStatus)}
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-[#1E40AF] animate-pulse" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-[#1E40AF] transition-colors" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-white border-2 border-gray-100 hover:border-[#1E40AF]/20 transition-colors">
                        <p className="text-xs text-gray-500 mb-1">总房间</p>
                        <p className="text-xl font-bold text-gray-900">
                          {stats.totalRooms}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#1E40AF]/10 to-[#3B82F6]/10 border-2 border-[#1E40AF]/20">
                        <p className="text-xs text-[#1E40AF] mb-1">空房</p>
                        <p className="text-xl font-bold text-[#1E40AF]">
                          {stats.availableRooms}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border-2 border-gray-100 hover:border-[#10B981]/20 transition-colors">
                        <p className="text-xs text-gray-500 mb-1">空房率</p>
                        <p className="text-xl font-bold text-[#10B981]">
                          {stats.totalRooms > 0
                            ? getEmptyRate(stats.availableRooms, stats.totalRooms)
                            : 0}%
                        </p>
                      </div>
                    </div>
                    
                    {/* 进度条 */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] transition-all duration-500"
                          style={{ 
                            width: `${stats.totalRooms > 0 
                              ? (stats.availableRooms / stats.totalRooms) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>

                {isExpanded && dormitoriesLoading && (
                  <Card shadow="sm" className="bg-gray-50 border-2 border-gray-200">
                    <div className="p-4 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-6 w-6 text-[#1E40AF] animate-spin" />
                        <span className="text-sm text-gray-600">加载房间数据...</span>
                      </div>
                    </div>
                  </Card>
                )}

                {isExpanded && !dormitoriesLoading && buildingDormitories.length > 0 && (
                  <Card shadow="md" className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">房间列表</h3>
                        <span className="text-xs text-gray-500">{buildingDormitories.length} 个房间</span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {buildingDormitories.map((dormitory: Dormitory, idx: number) => (
                          <div
                            key={dormitory.dorm_id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                              idx % 2 === 0 
                                ? 'bg-white hover:bg-[#1E40AF]/5' 
                                : 'bg-gray-50 hover:bg-[#1E40AF]/5'
                            } hover:shadow-sm border border-transparent hover:border-[#1E40AF]/20`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                dormitory.status === 'available' 
                                  ? 'bg-[#10B981]/10' 
                                  : dormitory.status === 'full' 
                                    ? 'bg-[#1E40AF]/10' 
                                    : 'bg-[#F59E0B]/10'
                              }`}>
                                <DoorOpen className={`h-4 w-4 ${
                                  dormitory.status === 'available' 
                                    ? 'text-[#10B981]' 
                                    : dormitory.status === 'full' 
                                      ? 'text-[#1E40AF]' 
                                      : 'text-[#F59E0B]'
                                }`} />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {dormitory.room_number}
                              </span>
                              {getRoomStatusBadge(dormitory.status)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">
                                {dormitory.occupied_beds}/{dormitory.bed_count}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!buildingsLoading && filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <Bed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">没有找到符合条件的楼栋</p>
        </div>
      )}
    </div>
  );
};

export default Dormitories;
