import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900',
    ghost: 'text-primary-500 hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700',
    success: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
};
const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
};
export const Button = React.forwardRef(({ variant = 'primary', size = 'md', isLoading = false, icon, iconPosition = 'left', disabled, className, children, ...props }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
    const classNames = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
    ].filter(Boolean).join(' ');
    return (_jsx("button", { ref: ref, className: classNames, disabled: disabled || isLoading, ...props, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [isLoading && (_jsx("span", { className: "inline-block animate-spin", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) })), icon && iconPosition === 'left' && !isLoading && icon, children, icon && iconPosition === 'right' && !isLoading && icon] }) }));
});
Button.displayName = 'Button';
