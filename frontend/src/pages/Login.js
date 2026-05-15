import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Alert } from '../components/common/Alert';
import { useAuthContext } from '../context/AuthContext';
import { isEmail, isStrongPassword } from '../utils/validators';
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuthContext();
    const [mode, setMode] = React.useState('login');
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        }
        else if (!isEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (mode === 'signup') {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            }
            else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
            if (!isStrongPassword(formData.password)) {
                newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        }
        catch (error) {
            setErrors({
                submit: error instanceof Error ? error.message : 'Authentication failed. Please try again.',
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8 animate-fadeIn", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-4 shadow-lg", children: _jsx("span", { className: "text-3xl font-bold text-white", children: "M" }) }), _jsx("h1", { className: "text-4xl font-bold text-neutral-900 dark:text-dark-text-primary mb-2", children: "MSP Assistant" }), _jsx("p", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "AWS Cost Intelligence Platform" })] }), _jsx(Card, { variant: "elevated", className: "animate-slideInUp", children: _jsxs(CardBody, { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-2 p-1 bg-neutral-100 dark:bg-dark-bg-tertiary rounded-lg", children: [_jsx("button", { onClick: () => {
                                            setMode('login');
                                            setErrors({});
                                            setFormData({ email: '', password: '', confirmPassword: '' });
                                        }, className: `flex-1 py-2 px-3 rounded font-medium transition-all ${mode === 'login'
                                            ? 'bg-white dark:bg-dark-bg-secondary text-primary-600 dark:text-primary-400 shadow'
                                            : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'}`, children: "Sign In" }), _jsx("button", { onClick: () => {
                                            setMode('signup');
                                            setErrors({});
                                            setFormData({ email: '', password: '', confirmPassword: '' });
                                        }, className: `flex-1 py-2 px-3 rounded font-medium transition-all ${mode === 'signup'
                                            ? 'bg-white dark:bg-dark-bg-secondary text-primary-600 dark:text-primary-400 shadow'
                                            : 'text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900'}`, children: "Sign Up" })] }), errors.submit && (_jsx(Alert, { variant: "danger", title: "Error", dismissible: true, children: errors.submit })), mode === 'login' && (_jsxs("div", { className: "p-3 bg-primary-50 dark:bg-blue-900/20 border border-primary-200 dark:border-blue-800 rounded-lg text-sm text-primary-800 dark:text-blue-200", children: [_jsx("strong", { children: "Demo Credentials:" }), _jsxs("div", { className: "mt-1 font-mono text-xs", children: ["Email: admin@example.com", _jsx("br", {}), "Password: Demo@123"] })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "Email Address", type: "email", name: "email", placeholder: "admin@example.com", value: formData.email, onChange: handleInputChange, error: errors.email, icon: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }), _jsx("div", { children: _jsx(Input, { label: "Password", type: showPassword ? 'text' : 'password', name: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.password, onChange: handleInputChange, error: errors.password, icon: _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300", children: showPassword ? (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" }) })) : (_jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })] })) }) }) }), mode === 'signup' && (_jsx(Input, { label: "Confirm Password", type: showPassword ? 'text' : 'password', name: "confirmPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.confirmPassword, onChange: handleInputChange, error: errors.confirmPassword })), mode === 'login' && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "w-4 h-4 rounded" }), _jsx("span", { className: "text-neutral-600 dark:text-dark-text-secondary", children: "Remember me" })] }), _jsx("a", { href: "#", className: "text-primary-600 dark:text-primary-400 hover:underline", children: "Forgot password?" })] })), _jsx(Button, { type: "submit", variant: "primary", size: "lg", isLoading: isLoading, className: "w-full", children: mode === 'login' ? 'Sign In' : 'Create Account' })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-neutral-200 dark:border-neutral-700" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white dark:bg-dark-bg-secondary text-neutral-500", children: "Or continue with" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Button, { variant: "outline", size: "md", className: "w-full", children: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }) }) }), _jsx(Button, { variant: "outline", size: "md", className: "w-full", children: _jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }) })] }), _jsx("div", { className: "text-center text-sm text-neutral-600 dark:text-dark-text-secondary", children: mode === 'login' ? (_jsxs(_Fragment, { children: ["Don't have an account?", ' ', _jsx("button", { onClick: () => setMode('signup'), className: "text-primary-600 dark:text-primary-400 font-semibold hover:underline", children: "Sign up" })] })) : (_jsxs(_Fragment, { children: ["Already have an account?", ' ', _jsx("button", { onClick: () => setMode('login'), className: "text-primary-600 dark:text-primary-400 font-semibold hover:underline", children: "Sign in" })] })) })] }) }), _jsx("div", { className: "text-center text-sm text-neutral-500 dark:text-dark-text-tertiary mt-8", children: _jsx("p", { children: "\u00A9 2026 MSP Assistant. All rights reserved." }) })] }) }));
};
export default Login;
