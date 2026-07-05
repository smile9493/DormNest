import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'student' | 'repairman';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'dormnest_token';
const USER_KEY = 'dormnest_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从本地存储恢复用户信息
    const storedUser = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // TODO: 实际应该调用后端 API
      // const response = await axios.post('/api/v1/auth/login', { username, password });

      // 模拟登录 - 根据 PRD 文档的三种角色
      let mockUser: User;
      if (username === 'admin') {
        mockUser = {
          id: '1',
          username: 'admin',
          name: '系统管理员',
          role: 'admin',
        };
      } else if (username === 'student') {
        mockUser = {
          id: '2',
          username: 'student',
          name: '张三',
          role: 'student',
        };
      } else if (username === 'repairman') {
        mockUser = {
          id: '3',
          username: 'repairman',
          name: '李师傅',
          role: 'repairman',
        };
      } else {
        throw new Error('用户名或密码错误');
      }

      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
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