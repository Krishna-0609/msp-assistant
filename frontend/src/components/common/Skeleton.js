import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
export const Skeleton = React.forwardRef(({ count = 1, height = 'h-4', width = 'w-full', circle = false, className, ...props }, ref) => {
    return (_jsx(_Fragment, { children: Array.from({ length: count }).map((_, i) => (_jsx("div", { ref: i === 0 ? ref : undefined, className: [
                'animate-shimmer bg-neutral-200 dark:bg-neutral-700',
                circle ? 'rounded-full' : 'rounded-lg',
                height,
                width,
                i > 0 && 'mt-2',
                className,
            ].filter(Boolean).join(' '), ...props }, i))) }));
});
Skeleton.displayName = 'Skeleton';
