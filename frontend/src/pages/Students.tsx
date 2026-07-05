import React, { useState } from 'react';
import { Search, UserPlus, LogOut, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// 模拟学生数据
const mockStudents = [
  { id: '2024001', name: '张三', gender: '男', department: '计算机学院', className: '计科2401', status: '在校', dormitory: 'A栋301' },
  { id: '2024002', name: '李四', gender: '女', department: '信息学院', className: '信管2401', status: '在校', dormitory: 'B栋205' },
  { id: '2024003', name: '王五', gender: '男', department: '数学学院', className: '数学2401', status: '毕业', dormitory: '-' },
  { id: '2024004', name: '赵六', gender: '女', department: '物理学院', className: '物理2401', status: '离校', dormitory: '-' },
  { id: '2024005', name: '钱七', gender: '男', department: '化学学院', className: '化学2401', status: '在校', dormitory: 'C栋401' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'default'> = {
  '在校': 'success',
  '毕业': 'warning',
  '离校': 'default',
};

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState(mockStudents);

  const filteredStudents = students.filter(
    (student) =>
      student.id.includes(searchTerm) ||
      student.name.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学生管理</h1>
          <p className="text-gray-600 mt-1">管理学生入住、退宿及详细信息</p>
        </div>
        <Button icon={<UserPlus className="h-4 w-4" />} variant="primary">
          添加学生
        </Button>
      </div>

      {/* 搜索框 */}
      <Card shadow="md" padding="md">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索学号或姓名..."
              icon={<Search className="h-5 w-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* 学生表格 */}
      <Card shadow="lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  学号
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  姓名
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  性别
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  院系
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  班级
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  入住状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  宿舍
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusVariant[student.status]} size="sm">
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {student.dormitory}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {student.status === '在校' && (
                        <>
                          <Button size="sm" variant="secondary">
                            入住办理
                          </Button>
                          <Button size="sm" variant="warning" icon={<LogOut className="h-3 w-3" />}>
                            退宿
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="primary" icon={<Eye className="h-3 w-3" />}>
                        详情
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            未找到匹配的学生信息
          </div>
        )}
      </Card>
    </div>
  );
}