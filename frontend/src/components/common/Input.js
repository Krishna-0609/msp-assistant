import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Input = React.forwardRef(({ label, error, helper, icon, iconPosition = 'left', className, ...props }, ref) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-neutral-700 dark:text-dark-text-primary mb-2", children: label })), _jsxs("div", { className: "relative", children: [icon && iconPosition === 'left' && (_jsx("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-600", children: icon })), _jsx("input", { ref: ref, className: [
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
                        ].filter(Boolean).join(' '), ...props }), icon && iconPosition === 'right' && (_jsx("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-600", children: icon }))] }), error && (_jsx("p", { className: "text-sm text-danger-600 dark:text-danger-400 mt-1", children: error })), helper && !error && (_jsx("p", { className: "text-sm text-neutral-500 dark:text-neutral-400 mt-1", children: helper }))] }));
});
Input.displayName = 'Input';
