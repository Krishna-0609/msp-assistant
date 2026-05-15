import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ConfidenceBar = ({ value, label, showLabel = true, animated = true, }) => {
    const clampedValue = Math.min(Math.max(value, 0), 100);
    const getColor = (val) => {
        if (val >= 80)
            return 'from-secondary-400 to-secondary-600';
        if (val >= 60)
            return 'from-warning-400 to-warning-600';
        return 'from-danger-400 to-danger-600';
    };
    return (_jsxs("div", { className: "space-y-2", children: [showLabel && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-neutral-700 dark:text-dark-text-secondary", children: label || 'Confidence' }), _jsxs("span", { className: "text-sm font-bold text-neutral-900 dark:text-dark-text-primary", children: [Math.round(clampedValue), "%"] })] })), _jsx("div", { className: "w-full h-2 bg-neutral-200 dark:bg-dark-bg-tertiary rounded-full overflow-hidden", children: _jsx("div", { className: `h-full bg-gradient-to-r ${getColor(clampedValue)} rounded-full ${animated ? 'animate-pulse' : ''}`, style: {
                        width: `${clampedValue}%`,
                        transition: 'width 0.5s ease-out',
                    } }) })] }));
};
