import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, UserPlus, LogOut, Eye, RefreshCw, Users, User, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { getStudents } from '@/api';
import type { Student } from '@/types/api';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'student_no' | 'name'>('student_no');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取学生列表
  const {
    data: studentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students', searchTerm, searchField, currentPage, pageSize],
    queryFn: () => getStudents(
      searchField === 'student_no' ? searchTerm : undefined,
      searchField === 'name' ? searchTerm : undefined,
      { page: currentPage, page_size: pageSize }
    ),
  });

  const students = studentsData?.items || [];
  const totalPages = studentsData?.total_pages || 1;
  const total = studentsData?.total || 0;

  const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
    'checked_in': 'success',
    'checked_out': 'default',
  };

  const statusLabel: Record<string, string> = {
    'checked_in': '在校',
    'checked_out': '离校',
  };

  const genderLabel: Record<string, string> = {
    'male': '男',
    'female': '女',
  };

  const genderIconColor: Record<string, string> = {
    'male': 'text-[#3B82F6]',
    'female': 'text-[#EC4899]',
  };

  const genderBgColor: Record<string, string> = {
    'male': 'bg-[#3B82F6]/10',
    'female': 'bg-[#EC4899]/10',
  };

  const handleRefresh = () => {
    refetch();
  };

  // 分页控制
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 重置分页当搜索条件改变
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学生管理</h1>
          <p className="text-gray-600 mt-1">管理学生入住、退宿及详细信息</p>
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
          <Button icon={<UserPlus className="h-4 w-4" />} variant="primary">
            添加学生
          </Button>
        </div>
      </div>

      {/* 搜索框 */}
      <Card shadow="md" padding="md" className="border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSearchField('student_no')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                searchField === 'student_no'
                  ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#1E40AF]/30 hover:shadow-md'
              }`}
            >
              学号
            </button>
            <button
              onClick={() => setSearchField('name')}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform ${
                searchField === 'name'
                  ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-[#1E40AF]/30 hover:shadow-md'
              }`}
            >
              姓名
            </button>
          </div>
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#1E40AF] transition-colors" />
              <input
                type="text"
                placeholder={`搜索${searchField === 'student_no' ? '学号' : '姓名'}...`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white hover:bg-white"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 学生表格 */}
      <Card shadow="lg" className="border border-gray-100">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-[#1E40AF] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <Users className="h-12 w-12 text-red-300 mx-auto mb-3" />
              <p className="text-red-500">学生数据加载失败，请点击刷新按钮重试</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    学号
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    姓名
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    性别
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    班级
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    入住状态
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    宿舍
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student: Student, idx: number) => (
                  <tr 
                    key={student.id} 
                    className={`transition-all duration-200 ${
                      idx % 2 === 0 
                        ? 'bg-white hover:bg-[#1E40AF]/5' 
                        : 'bg-gray-50 hover:bg-[#1E40AF]/5'
                    } hover:shadow-sm`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] flex items-center justify-center shadow-md">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {student.student_no}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${genderBgColor[student.gender]}`}>
                          <User className={`h-4 w-4 ${genderIconColor[student.gender]}`} />
                        </div>
                        <span className={`text-sm font-medium ${genderIconColor[student.gender]}`}>
                          {genderLabel[student.gender]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.class_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={statusVariant[student.status]} 
                        size="sm"
                        className="shadow-sm"
                      >
                        {statusLabel[student.status]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        {student.dormitory_room && (
                          <div className="p-2 rounded-lg bg-[#1E40AF]/10">
                            <Users className="h-4 w-4 text-[#1E40AF]" />
                          </div>
                        )}
                        <span className="font-medium">
                          {student.dormitory_room ? `${student.building_name || ''} ${student.dormitory_room}` : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {student.status === 'checked_in' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              className="hover:shadow-md transition-all"
                            >
                              入住办理
                            </Button>
                            <Button 
                              size="sm" 
                              variant="warning" 
                              icon={<LogOut className="h-4 w-4" />}
                              className="hover:shadow-md transition-all"
                            >
                              退宿
                            </Button>
                          </>
                        )}
                        {student.status === 'checked_out' && (
                          <Button 
                            size="sm" 
                            variant="secondary"
                            className="hover:shadow-md transition-all"
                          >
                            入住办理
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="primary" 
                          icon={<Eye className="h-4 w-4" />}
                          className="hover:shadow-lg transition-all"
                        >
                          详情
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!isLoading && !error && students.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">未找到匹配的学生信息</p>
            <p className="text-gray-400 text-sm mt-1">请尝试修改搜索条件</p>
          </div>
        )}
      </Card>

      {/* 分页控制 */}
      {!isLoading && !error && students.length > 0 && (
        <Card shadow="md" padding="md" className="border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                显示第 <span className="font-semibold text-[#1E40AF]">{(currentPage - 1) * pageSize + 1}</span> 到 
                <span className="font-semibold text-[#1E40AF]">{Math.min(currentPage * pageSize, total)}</span> 条，
                共 <span className="font-semibold text-[#1E40AF]">{total}</span> 条记录
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">每页显示:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border-2 border-gray-200 rounded-lg text-sm focus:border-[#1E40AF] focus:ring-0 transition-all outline-none bg-gray-50 focus:bg-white"
                >
                  <option value="5">5 条</option>
                  <option value="10">10 条</option>
                  <option value="20">20 条</option>
                  <option value="50">50 条</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                icon={<ChevronLeft className="h-4 w-4" />}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="hover:shadow-md transition-all"
              >
                上一页
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1E40AF]/30 hover:shadow-md'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === totalPages
                        ? 'bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white shadow-lg scale-105'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#1E40AF]/30 hover:shadow-md'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <Button
                size="sm"
                variant="secondary"
                icon={<ChevronRight className="h-4 w-4" />}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="hover:shadow-md transition-all"
              >
                下一页
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}