import { Building2, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo 和标题 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">宿舍管理系统</h1>
            <p className="text-xs text-gray-500">Dormitory Management System</p>
          </div>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700">{user?.name || '未登录'}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'admin' && '系统管理员'}
                {user?.role === 'student' && '学生'}
                {user?.role === 'repairman' && '维修人员'}
              </p>
            </div>
          </div>

          {/* 退出按钮 */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">退出</span>
          </button>
        </div>
      </div>
    </header>
  );
}