import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
const Reports = () => {
    const reports = [
        {
            id: '1',
            name: 'Monthly Cost Report',
            type: 'cost',
            period: 'May 2026',
            generatedAt: '2026-05-14',
            pages: 12,
            status: 'ready',
        },
        {
            id: '2',
            name: 'Security Findings',
            type: 'security',
            period: 'May 2026',
            generatedAt: '2026-05-13',
            pages: 8,
            status: 'ready',
        },
        {
            id: '3',
            name: 'Performance Analysis',
            type: 'performance',
            period: 'May 2026',
            generatedAt: '2026-05-10',
            pages: 15,
            status: 'ready',
        },
    ];
    return (_jsxs("div", { className: "p-4 sm:p-6 lg:p-8 space-y-6", children: [_jsxs("div", { className: "animate-slideInUp", children: [_jsx("h1", { className: "text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2", children: "Reports" }), _jsx("p", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "View and download your analysis reports" })] }), _jsx(Card, { variant: "default", className: "bg-gradient-to-r from-primary-500 to-primary-600 border-0 animate-slideInUp animate-stagger-1", children: _jsx(CardBody, { className: "text-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-1", children: "Generate New Report" }), _jsx("p", { className: "text-primary-100", children: "Create a comprehensive analysis of your AWS infrastructure" })] }), _jsx(Button, { variant: "ghost", size: "lg", className: "text-white hover:bg-white/10", children: "Generate \u2192" })] }) }) }), _jsxs("div", { className: "flex flex-wrap gap-2 animate-slideInUp animate-stagger-2", children: [_jsx(Button, { variant: "primary", size: "sm", children: "All Reports" }), _jsx(Button, { variant: "outline", size: "sm", children: "Cost" }), _jsx(Button, { variant: "outline", size: "sm", children: "Security" }), _jsx(Button, { variant: "outline", size: "sm", children: "Performance" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slideInUp animate-stagger-3", children: reports.map((report, idx) => (_jsx(Card, { variant: "default", interactive: true, className: "animate-fadeIn", style: { animationDelay: `${idx * 0.1}s` }, children: _jsxs(CardBody, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-neutral-900 dark:text-dark-text-primary", children: report.name }), _jsx("p", { className: "text-sm text-neutral-600 dark:text-dark-text-secondary mt-1", children: report.period })] }), _jsx(Badge, { variant: report.type === 'cost' ? 'primary' :
                                            report.type === 'security' ? 'danger' :
                                                'warning', children: report.type })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-neutral-600 dark:text-dark-text-secondary", children: [_jsxs("div", { children: ["\uD83D\uDCC4 ", report.pages, " pages"] }), _jsxs("div", { children: ["\u2713 ", report.status] })] }), _jsxs("p", { className: "text-xs text-neutral-500 dark:text-dark-text-tertiary", children: ["Generated ", report.generatedAt] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Button, { variant: "outline", size: "sm", className: "flex-1", children: "View" }), _jsx(Button, { variant: "primary", size: "sm", className: "flex-1", children: "\u2B07\uFE0F Download" })] })] }) }, report.id))) }), _jsxs(Card, { variant: "default", className: "animate-slideInUp animate-stagger-4", children: [_jsx(CardHeader, { children: _jsx("h3", { className: "text-lg font-semibold text-neutral-900 dark:text-dark-text-primary", children: "Scheduled Reports" }) }), _jsx(CardBody, { children: _jsx("div", { className: "space-y-3", children: [
                                { name: 'Weekly Cost Summary', schedule: 'Every Monday at 9:00 AM', next: 'May 20, 2026' },
                                { name: 'Monthly Security Audit', schedule: 'First day of month at 2:00 PM', next: 'June 1, 2026' },
                                { name: 'Quarterly Business Review', schedule: 'Last day of quarter', next: 'June 30, 2026' },
                            ].map((sched, idx) => (_jsxs("div", { className: "flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-neutral-900 dark:text-dark-text-primary", children: sched.name }), _jsx("p", { className: "text-sm text-neutral-600 dark:text-dark-text-secondary mt-1", children: sched.schedule })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm text-neutral-600 dark:text-dark-text-secondary", children: ["Next: ", sched.next] }), _jsx(Button, { variant: "ghost", size: "sm", className: "mt-2", children: "Edit" })] })] }, idx))) }) })] })] }));
};
export default Reports;
