import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/Login';

// 占位符页面组件
function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">仪表盘</h1>
      <p className="text-gray-600">仪表盘页面 - 开发中</p>
    </div>
  );
}

function Dormitories() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">宿舍管理</h1>
      <p className="text-gray-600">宿舍管理页面 - 开发中</p>
    </div>
  );
}

function Students() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">学生管理</h1>
      <p className="text-gray-600">学生管理页面 - 开发中</p>
    </div>
  );
}

function Repairs() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">报修中心</h1>
      <p className="text-gray-600">报修中心页面 - 开发中</p>
    </div>
  );
}

function Charges() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">费用管理</h1>
      <p className="text-gray-600">费用管理页面 - 开发中</p>
    </div>
  );
}

function Announcements() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">公告通知</h1>
      <p className="text-gray-600">公告通知页面 - 开发中</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 登录页 */}
          <Route path="/login" element={<Login />} />

          {/* 受保护的路由 - 使用 MainLayout 包裹 */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/dormitories"
            element={
              <MainLayout>
                <Dormitories />
              </MainLayout>
            }
          />
          <Route
            path="/students"
            element={
              <MainLayout>
                <Students />
              </MainLayout>
            }
          />
          <Route
            path="/repairs"
            element={
              <MainLayout>
                <Repairs />
              </MainLayout>
            }
          />
          <Route
            path="/charges"
            element={
              <MainLayout>
                <Charges />
              </MainLayout>
            }
          />
          <Route
            path="/announcements"
            element={
              <MainLayout>
                <Announcements />
              </MainLayout>
            }
          />

          {/* 默认路由重定向 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 页面 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <p className="text-gray-600">页面不存在</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}