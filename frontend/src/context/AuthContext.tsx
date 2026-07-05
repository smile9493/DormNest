import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/auth';
import type { UserInfo } from '@/types/api';

export type UserRole = 'admin' | 'dorm_manager' | 'student';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'user_info';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从本地存储恢复用户信息
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem('access_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // 调用真实API登录
      const response = await apiLogin(username, password);

      // 转换用户信息
      const userInfo: User = {
        id: response.user.id,
        username: response.user.username,
        name: response.user.real_name || response.user.username,
        role: response.user.role as UserRole,
        email: response.user.email,
        phone: response.user.phone,
      };

      // 保存用户信息到本地存储
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      setUser(userInfo);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}