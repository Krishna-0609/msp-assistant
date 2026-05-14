import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 dark:bg-dark-bg-tertiary text-neutral-800 dark:text-dark-text-primary',
  primary: 'bg-primary-100 dark:bg-blue-900/30 text-primary-700 dark:text-blue-200',
  success: 'bg-secondary-100 dark:bg-green-900/30 text-secondary-700 dark:text-green-200',
  warning: 'bg-warning-100 dark:bg-yellow-900/30 text-warning-700 dark:text-yellow-200',
  danger: 'bg-danger-100 dark:bg-red-900/30 text-danger-700 dark:text-red-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-2.5 py-1 text-sm font-medium',
  lg: 'px-3 py-1.5 text-base font-medium',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, className, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center gap-1 rounded-full whitespace-nowrap';

    const classNames = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {dot && (
          <span className="inline-block w-2 h-2 bg-current rounded-full" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
