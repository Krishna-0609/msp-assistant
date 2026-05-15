import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../common/Card';
export const DataTable = React.forwardRef(({ columns, data, onRowClick }, ref) => {
    return (_jsx(Card, { ref: ref, variant: "default", className: "w-full overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-dark-bg-tertiary", children: _jsx("tr", { children: columns.map((col) => (_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-dark-text-primary", children: col.label }, String(col.key)))) }) }), _jsx("tbody", { children: data.map((row, idx) => (_jsx("tr", { onClick: () => onRowClick?.(row), className: "border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-dark-bg-tertiary transition-colors", children: columns.map((col) => (_jsx("td", { className: "px-6 py-4 text-sm text-neutral-900 dark:text-dark-text-primary", children: col.render ? col.render(row[col.key], row) : row[col.key] }, String(col.key)))) }, idx))) })] }) }));
});
DataTable.displayName = 'DataTable';
