import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Dormitories } from '@/pages/Dormitories';
import Students from '@/pages/Students';
import Repairs from '@/pages/Repairs';
import Charges from '@/pages/Charges';
import Announcements from '@/pages/Announcements';

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