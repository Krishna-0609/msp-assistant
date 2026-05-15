import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const variantClasses = {
    default: {
        bg: 'bg-primary-50 dark:bg-blue-900/20',
        border: 'border border-primary-200 dark:border-blue-800',
        text: 'text-primary-800 dark:text-blue-200',
        icon: 'text-primary-500',
    },
    success: {
        bg: 'bg-secondary-50 dark:bg-green-900/20',
        border: 'border border-secondary-200 dark:border-green-800',
        text: 'text-secondary-800 dark:text-green-200',
        icon: 'text-secondary-500',
    },
    warning: {
        bg: 'bg-warning-50 dark:bg-yellow-900/20',
        border: 'border border-warning-200 dark:border-yellow-800',
        text: 'text-warning-800 dark:text-yellow-200',
        icon: 'text-warning-500',
    },
    danger: {
        bg: 'bg-danger-50 dark:bg-red-900/20',
        border: 'border border-danger-200 dark:border-red-800',
        text: 'text-danger-800 dark:text-red-200',
        icon: 'text-danger-500',
    },
};
const icons = {
    default: (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) })),
    success: (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) })),
    warning: (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) })),
    danger: (_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) })),
};
export const Alert = React.forwardRef(({ variant = 'default', title, onClose, dismissible = true, className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };
    if (!isOpen)
        return null;
    const classes = variantClasses[variant];
    const classNames = [
        'rounded-lg p-4 transition-all',
        classes.bg,
        classes.border,
        classes.text,
        className,
    ].filter(Boolean).join(' ');
    return (_jsx("div", { ref: ref, className: classNames, role: "alert", ...props, children: _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: `flex-shrink-0 mt-0.5 ${classes.icon}`, children: icons[variant] }), _jsxs("div", { className: "flex-1", children: [title && _jsx("div", { className: "font-semibold", children: title }), children && _jsx("div", { className: "text-sm mt-1", children: children })] }), dismissible && (_jsx("button", { onClick: handleClose, className: "flex-shrink-0 text-inherit hover:opacity-75 transition-opacity", "aria-label": "Close alert", children: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) }))] }) }));
});
Alert.displayName = 'Alert';
