import React, { forwardRef, useId } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// 样式合并工具函数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 输入框状态类型
type InputStatus = 'default' | 'success' | 'error';

// 输入框属性接口
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: React.ReactNode;
  status?: InputStatus;
}

// 状态样式映射
const statusStyles: Record<InputStatus, string> = {
  default: 'border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF]',
  success: 'border-[#10B981] focus:border-[#10B981] focus:ring-[#10B981]',
  error: 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, icon, status = 'default', className, id, ...props }, ref) => {
    const generatedId = useId();
    // 自动根据 error 或 success 设置状态
    const autoStatus: InputStatus = error ? 'error' : success ? 'success' : status;
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border-2 bg-white',
              'transition-all duration-300 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              'placeholder:text-gray-400',
              statusStyles[autoStatus],
              icon && 'pl-10',
              className
            )}
            {...props}
          />
          {autoStatus === 'success' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10B981]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          {autoStatus === 'error' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF4444]">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-[#EF4444] flex items-center gap-1">
            {error}
          </p>
        )}
        {success && !error && (
          <p className="mt-1.5 text-sm text-[#10B981] flex items-center gap-1">
            {success}
          </p>
        )}
        {hint && !error && !success && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';