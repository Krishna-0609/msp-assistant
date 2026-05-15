import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const Sidebar = ({ items, isOpen = true, onClose }) => {
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 z-30 md:hidden", onClick: onClose })), _jsx("aside", { className: [
                    'fixed md:static top-0 left-0 h-screen z-40',
                    'w-64 bg-white dark:bg-dark-bg-secondary',
                    'border-r border-neutral-200 dark:border-neutral-700',
                    'transform transition-transform duration-300 ease-out md:transform-none',
                    'overflow-y-auto',
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                ].join(' '), children: _jsx("nav", { className: "p-4 space-y-1", children: items.map((item, idx) => (_jsxs("a", { href: item.href, className: [
                            'flex items-center justify-between px-4 py-3 rounded-lg',
                            'transition-all duration-200 group',
                            item.active
                                ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                : 'text-neutral-700 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary',
                        ].join(' '), children: [_jsxs("span", { className: "flex items-center gap-3", children: [_jsx("span", { className: [
                                            'w-6 h-6',
                                            item.active ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 group-hover:text-neutral-600',
                                        ].join(' '), children: item.icon }), _jsx("span", { className: "font-medium", children: item.label })] }), item.badge && item.badge > 0 && (_jsx("span", { className: "inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-danger-500 rounded-full", children: item.badge > 9 ? '9+' : item.badge }))] }, idx))) }) })] }));
};
