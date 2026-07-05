import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/auth';
import type { UserInfo } from '@/types/api';

export type UserRole = 'admin' | 'student' | 'repairman';

export interface User {
  id: number;
  username: string;
  real_name?: string;
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
    const token = localStorage.getItem('access_token');

    if (token) {
      // 通过服务端验证 token 有效性并获取最新用户信息
      getCurrentUser()
        .then((res) => {
          const serverUser = res.data as UserInfo;
          const userInfo: User = {
            id: serverUser.id,
            username: serverUser.username,
            real_name: serverUser.real_name,
            role: serverUser.role as UserRole,
            email: serverUser.email,
            phone: serverUser.phone,
          };
          localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
          setUser(userInfo);
        })
        .catch(() => {
          // token 无效或过期，清除本地存储
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem('access_token');
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiLogin(username, password);

      const userInfo: User = {
        id: response.user.id,
        username: response.user.username,
        real_name: response.user.real_name,
        role: response.user.role as UserRole,
        email: response.user.email,
        phone: response.user.phone,
      };

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