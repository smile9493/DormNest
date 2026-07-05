import {
  LayoutDashboard,
  Building2,
  Users,
  Wrench,
  DollarSign,
  Bell,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/context/AuthContext';

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'student', 'repairman'],
  },
  {
    path: '/dormitories',
    name: '宿舍管理',
    icon: <Building2 className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/students',
    name: '学生管理',
    icon: <Users className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    path: '/repairs',
    name: '报修中心',
    icon: <Wrench className="w-5 h-5" />,
    roles: ['admin', 'student', 'repairman'],
  },
  {
    path: '/charges',
    name: '费用管理',
    icon: <DollarSign className="w-5 h-5" />,
    roles: ['admin', 'student'],
  },
  {
    path: '/announcements',
    name: '公告通知',
    icon: <Bell className="w-5 h-5" />,
    roles: ['admin', 'student', 'repairman'],
  },
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (!user || !item.roles.includes(user.role)) return null;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="px-4 py-3 rounded-lg bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            © 2024 宿舍管理系统
          </p>
        </div>
      </div>
    </aside>
  );
}