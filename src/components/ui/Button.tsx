'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer select-none btn-ripple disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2';

    const variants = {
      primary:
        'bg-[#FF6B35] text-white hover:bg-[#E55A24] active:scale-[0.98] shadow-sm hover:shadow-md focus-visible:ring-[#FF6B35]',
      secondary:
        'bg-[#F8F9FA] text-[#1A1A2E] hover:bg-[#F1F3F5] active:scale-[0.98] border border-[#E9ECEF]',
      ghost:
        'bg-transparent text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#1A1A2E] active:scale-[0.98]',
      danger:
        'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-sm',
      outline:
        'bg-transparent border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-sm gap-1.5',
      md: 'px-6 py-2.5 text-sm gap-2',
      lg: 'px-8 py-3.5 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
