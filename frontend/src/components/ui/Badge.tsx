import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 样式合并工具函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 徽章变体类型
type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

// 徽章尺寸类型
type BadgeSize = 'sm' | 'md' | 'lg';

// 徽章属性接口
interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

// 变体样式映射
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-[#1E40AF]/10 text-[#1E40AF]',
  success: 'bg-[#10B981]/10 text-[#10B981]',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  error: 'bg-[#EF4444]/10 text-[#EF4444]',
  info: 'bg-[#3B82F6]/10 text-[#3B82F6]',
};

// 尺寸样式映射
const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium',
        'transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full',
            size === 'sm' && 'h-1.5 w-1.5',
            size === 'md' && 'h-2 w-2',
            size === 'lg' && 'h-2.5 w-2.5',
            variant === 'default' && 'bg-gray-600',
            variant === 'primary' && 'bg-[#1E40AF]',
            variant === 'success' && 'bg-[#10B981]',
            variant === 'warning' && 'bg-[#F59E0B]',
            variant === 'error' && 'bg-[#EF4444]',
            variant === 'info' && 'bg-[#3B82F6]'
          )}
        />
      )}
      {children}
    </span>
  );
};