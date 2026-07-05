import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

// 样式合并工具函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 按钮变体类型
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

// 按钮尺寸类型
type ButtonSize = 'sm' | 'md' | 'lg';

// 按钮属性接口
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// 变体样式映射
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#1E40AF] hover:bg-[#1E3A8A] text-white shadow-md hover:shadow-lg',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-md hover:shadow-lg',
  success: 'bg-[#10B981] hover:bg-[#059669] text-white shadow-md hover:shadow-lg',
  warning: 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md hover:shadow-lg',
  error: 'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md hover:shadow-lg',
};

// 尺寸样式映射
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E40AF]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};