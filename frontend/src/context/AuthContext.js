import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const AuthContext = React.createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    // Verify token with backend
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            }
            catch (error) {
                console.error('Auth check failed:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Demo credentials
            if (email === 'admin@example.com' && password === 'Demo@123') {
                const mockUser = {
                    id: '1',
                    email,
                    name: 'Admin User',
                    role: 'admin',
                    createdAt: new Date().toISOString(),
                };
                setUser(mockUser);
                localStorage.setItem('authToken', 'mock-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify(mockUser));
            }
            else {
                throw new Error('Invalid credentials. Use admin@example.com / Demo@123');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
export const useAuthContext = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};
