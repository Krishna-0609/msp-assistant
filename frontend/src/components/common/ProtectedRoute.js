import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Card, CardBody } from './Card';
export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthContext();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-dark-bg-primary", children: _jsx(Card, { children: _jsxs(CardBody, { className: "flex flex-col items-center gap-4", children: [_jsx("div", { className: "animate-spin", children: _jsx("svg", { className: "w-8 h-8 text-primary-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsx("p", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Loading..." })] }) }) }));
    }
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
