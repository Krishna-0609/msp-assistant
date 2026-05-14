import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, iconPosition = 'left', className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-dark-text-primary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-600">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={[
              'w-full px-4 py-2 rounded-lg border-2 transition-colors',
              'bg-white dark:bg-dark-bg-secondary',
              'text-neutral-900 dark:text-dark-text-primary',
              'placeholder-neutral-400 dark:placeholder-neutral-600',
              error
                ? 'border-danger-500 dark:border-danger-500'
                : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-500',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              'focus:outline-none',
              className,
            ].filter(Boolean).join(' ')}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-600">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger-600 dark:text-danger-400 mt-1">
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
