import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { ChatWindow } from '../components/chat/ChatWindow';
const Chat = () => {
    const [messages, setMessages] = React.useState([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I\'m your MSP Assistant. I can help you analyze AWS costs, identify security issues, and optimize your infrastructure. What would you like to know?',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            confidence: 95,
        },
    ]);
    const [input, setInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const handleSend = async () => {
        if (!input.trim())
            return;
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        // Simulate AI response delay
        setTimeout(() => {
            const assistantMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: `I understand you asked about "${input}". I'm analyzing your AWS infrastructure to provide the best recommendations. In a production environment, I would connect to AWS Bedrock with Claude 3.5 Sonnet to give you detailed insights.`,
                timestamp: new Date().toISOString(),
                confidence: 78,
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1500);
    };
    return (_jsxs("div", { className: "p-4 sm:p-6 lg:p-8 space-y-6", children: [_jsxs("div", { className: "animate-slideInUp", children: [_jsx("h1", { className: "text-3xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2", children: "AI Assistant" }), _jsx("p", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Chat with Claude 3.5 Sonnet powered by AWS Bedrock" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6 animate-slideInUp animate-stagger-1", children: [_jsxs("div", { className: "lg:col-span-3 space-y-4", children: [_jsx(ChatWindow, { messages: messages, isLoading: isLoading }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { placeholder: "Ask about costs, security, performance...", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSend(), icon: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx(Button, { variant: "primary", size: "md", onClick: handleSend, isLoading: isLoading, disabled: !input.trim() || isLoading, children: "Send" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { variant: "default", children: [_jsx(CardHeader, { divider: true, children: _jsx("h3", { className: "font-semibold text-neutral-900 dark:text-dark-text-primary", children: "Quick Actions" }) }), _jsxs(CardBody, { className: "space-y-2", children: [_jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "\uD83D\uDCB0 Analyze Costs" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "\uD83D\uDD12 Security Audit" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "\u26A1 Performance Tips" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "\uD83D\uDCCA Generate Report" })] })] }), _jsxs(Card, { variant: "default", children: [_jsx(CardHeader, { divider: true, children: _jsx("h3", { className: "font-semibold text-neutral-900 dark:text-dark-text-primary", children: "Capabilities" }) }), _jsxs(CardBody, { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary-500", children: "\u2713" }), _jsx("span", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Cost analysis" })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary-500", children: "\u2713" }), _jsx("span", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Security recommendations" })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary-500", children: "\u2713" }), _jsx("span", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Performance optimization" })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-primary-500", children: "\u2713" }), _jsx("span", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Compliance checks" })] })] })] })] })] })] }));
};
export default Chat;
