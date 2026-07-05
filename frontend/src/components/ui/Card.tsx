import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 样式合并工具函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 卡片阴影类型
type CardShadow = 'none' | 'sm' | 'md' | 'lg';

// 卡片属性接口
interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: CardShadow;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// 卡片头部属性接口
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

// 卡片标题属性接口
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

// 卡片内容属性接口
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// 卡片底部属性接口
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// 阴影样式映射
const shadowStyles: Record<CardShadow, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg hover:shadow-xl transition-shadow duration-300',
};

// 内边距样式映射
const paddingStyles: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Title: React.FC<CardTitleProps>;
  Content: React.FC<CardContentProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, className, shadow = 'md', padding = 'none' }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200',
        'transition-all duration-300 ease-in-out',
        shadowStyles[shadow],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className }) => {
  return (
    <div className={cn('border-b border-gray-200 px-4 py-3', className)}>
      {children}
    </div>
  );
};

Card.Title = ({ children, className }) => {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

Card.Content = ({ children, className }) => {
  return <div className={cn('px-4 py-3', className)}>{children}</div>;
};

Card.Footer = ({ children, className }) => {
  return (
    <div className={cn('border-t border-gray-200 px-4 py-3', className)}>
      {children}
    </div>
  );
};