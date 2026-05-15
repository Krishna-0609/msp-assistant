import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
const getStatusColor = (status) => {
    switch (status) {
        case 'low':
            return 'success';
        case 'high':
            return 'danger';
        default:
            return 'warning';
    }
};
const getTrendIcon = (trend) => {
    switch (trend) {
        case 'up':
            return (_jsxs("svg", { className: "w-4 h-4 text-danger-500", fill: "currentColor", viewBox: "0 0 20 20", children: [_jsx("path", { d: "M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" }), _jsx("path", { d: "M3.293 9.293a1 1 0 011.414 0L10 14.586l5.293-5.293a1 1 0 111.414 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414z" })] }));
        case 'down':
            return (_jsxs("svg", { className: "w-4 h-4 text-secondary-500", fill: "currentColor", viewBox: "0 0 20 20", children: [_jsx("path", { d: "M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" }), _jsx("path", { d: "M16.707 10.707a1 1 0 01-1.414 0L10 5.414 4.707 10.707a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 010 1.414z" })] }));
        default:
            return (_jsx("svg", { className: "w-4 h-4 text-neutral-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M5.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" }) }));
    }
};
export const CostCard = ({ service, amount, currency = '$', trend, trendPercent, status, badge, }) => {
    return (_jsx(Card, { variant: "default", className: "h-full hover:shadow-lg transition-shadow", children: _jsx(CardBody, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-dark-text-primary", children: service }), _jsxs("p", { className: "text-3xl font-bold text-primary-500 mt-2", children: [currency, amount.toFixed(2)] })] }), badge && (_jsx(Badge, { variant: getStatusColor(status), size: "sm", children: badge }))] }), trend && trendPercent !== undefined && (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [getTrendIcon(trend), _jsxs("span", { className: trend === 'up' ? 'text-danger-600 dark:text-danger-400' :
                                    trend === 'down' ? 'text-secondary-600 dark:text-secondary-400' :
                                        'text-neutral-600 dark:text-neutral-400', children: [trend === 'up' ? '+' : trend === 'down' ? '-' : '', trendPercent, "% this month"] })] }))] }) }) }));
};
