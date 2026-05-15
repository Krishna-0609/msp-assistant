import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
export const MainLayout = ({ children, headerProps = {}, sidebarProps = {}, }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    return (_jsxs("div", { className: "min-h-screen bg-white dark:bg-dark-bg-primary", children: [_jsx(Header, { ...headerProps }), _jsxs("div", { className: "flex", children: [_jsx(Sidebar, { ...sidebarProps, isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsx("main", { className: "flex-1 bg-neutral-50 dark:bg-dark-bg-primary", children: children })] })] }));
};
