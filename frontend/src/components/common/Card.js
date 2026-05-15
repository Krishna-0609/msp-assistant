import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const variantClasses = {
    default: 'bg-white dark:bg-dark-bg-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg',
    elevated: 'bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg',
    outline: 'bg-transparent border-2 border-primary-500 rounded-lg',
};
export const Card = React.forwardRef(({ variant = 'default', interactive = false, className, children, ...props }, ref) => {
    const baseClasses = 'transition-all duration-200';
    const interactiveClasses = interactive ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : '';
    const classNames = [
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        className,
    ].filter(Boolean).join(' ');
    return (_jsx("div", { ref: ref, className: classNames, ...props, children: children }));
});
Card.displayName = 'Card';
export const CardHeader = React.forwardRef(({ divider = true, className, ...props }, ref) => {
    const dividerClass = divider ? 'border-b border-neutral-200 dark:border-neutral-700' : '';
    const classNames = ['p-4 sm:p-6', dividerClass, className].filter(Boolean).join(' ');
    return _jsx("div", { ref: ref, className: classNames, ...props });
});
CardHeader.displayName = 'CardHeader';
export const CardBody = React.forwardRef(({ className, ...props }, ref) => {
    const classNames = ['p-4 sm:p-6', className].filter(Boolean).join(' ');
    return _jsx("div", { ref: ref, className: classNames, ...props });
});
CardBody.displayName = 'CardBody';
export const CardFooter = React.forwardRef(({ divider = true, className, ...props }, ref) => {
    const dividerClass = divider ? 'border-t border-neutral-200 dark:border-neutral-700' : '';
    const classNames = ['p-4 sm:p-6', dividerClass, className].filter(Boolean).join(' ');
    return _jsx("div", { ref: ref, className: classNames, ...props });
});
CardFooter.displayName = 'CardFooter';
