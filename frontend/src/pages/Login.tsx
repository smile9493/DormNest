import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { Building2, User, Lock, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/types/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 自动消失错误提示
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 读取重定向目标路径
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // 如果已登录，重定向到仪表盘
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate(redirectPath);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message || (err instanceof Error ? err.message : '登录失败，请重试'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧品牌展示区 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">宿舍管理系统</h1>
              <p className="text-blue-200">Dormitory Management System</p>
            </div>
          </div>

          <div className="space-y-6 text-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <p className="text-lg">高效的宿舍资源管理平台</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <p className="text-lg">智能化的入住退宿流程</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <p className="text-lg">便捷的报修工单处理</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <p className="text-lg">透明的费用核算系统</p>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧表单区 */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">欢迎登录</h2>
              <p className="text-gray-500">请输入您的账号信息</p>
            </div>

            {/* 测试账号提示 - 仅开发环境显示 */}
            {import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 font-medium mb-2">测试账号：</p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>管理员：admin</p>
                <p>学生：student</p>
                <p>维修：repairman</p>
              </div>
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 错误提示 */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-sm animate-fade-in">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-red-700 font-medium flex-1">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* 用户名输入 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  用户名
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#1E40AF]">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-[#1E40AF] transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#1E40AF] transition-all outline-none bg-gray-50 focus:bg-white hover:bg-white text-gray-900 placeholder-gray-400"
                    placeholder="请输入用户名"
                    required
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  密码
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#1E40AF] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#1E40AF] transition-all outline-none bg-gray-50 focus:bg-white hover:bg-white text-gray-900 placeholder-gray-400"
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 记住登录 */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-5 h-5 text-[#1E40AF] border-2 border-gray-300 rounded focus:ring-[#1E40AF] focus:ring-2 cursor-pointer transition-all"
                    />
                  </div>
                  <span className="ml-2.5 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">记住密码</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-[#1E40AF] hover:text-[#1E3A8A] transition-colors font-medium hover:underline"
                >
                  忘记密码？
                </a>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-[#1E40AF]/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    登录中...
                  </span>
                ) : (
                  '登录'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账号？{' '}
                <a
                  href="#"
                  className="text-[#1E40AF] hover:text-[#1E3A8A] font-semibold transition-colors hover:underline"
                >
                  立即注册
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}