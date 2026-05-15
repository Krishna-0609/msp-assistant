import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../common/Card';
export const ChatWindow = ({ messages, isLoading = false }) => {
    const endRef = React.useRef(null);
    React.useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (_jsx(Card, { variant: "default", className: "h-96 flex flex-col", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((msg) => (_jsx("div", { className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsx("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-100 dark:bg-dark-bg-secondary text-neutral-900 dark:text-dark-text-primary'}`, children: msg.content }) }, msg.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-neutral-100 dark:bg-dark-bg-secondary px-4 py-2 rounded-lg", children: _jsxs("div", { className: "flex gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-neutral-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-neutral-400 rounded-full animate-bounce", style: { animationDelay: '0.1s' } }), _jsx("div", { className: "w-2 h-2 bg-neutral-400 rounded-full animate-bounce", style: { animationDelay: '0.2s' } })] }) }) })), _jsx("div", { ref: endRef })] }) }));
};
