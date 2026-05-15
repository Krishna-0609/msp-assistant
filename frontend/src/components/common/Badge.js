import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const variantClasses = {
    default: 'bg-neutral-100 dark:bg-dark-bg-tertiary text-neutral-800 dark:text-dark-text-primary',
    primary: 'bg-primary-100 dark:bg-blue-900/30 text-primary-700 dark:text-blue-200',
    success: 'bg-secondary-100 dark:bg-green-900/30 text-secondary-700 dark:text-green-200',
    warning: 'bg-warning-100 dark:bg-yellow-900/30 text-warning-700 dark:text-yellow-200',
    danger: 'bg-danger-100 dark:bg-red-900/30 text-danger-700 dark:text-red-200',
};
const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-sm font-medium',
    lg: 'px-3 py-1.5 text-base font-medium',
};
export const Badge = React.forwardRef(({ variant = 'default', size = 'md', dot = false, className, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center gap-1 rounded-full whitespace-nowrap';
    const classNames = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
    ].filter(Boolean).join(' ');
    return (_jsxs("span", { ref: ref, className: classNames, ...props, children: [dot && (_jsx("span", { className: "inline-block w-2 h-2 bg-current rounded-full" })), children] }));
});
Badge.displayName = 'Badge';
