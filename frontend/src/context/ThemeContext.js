import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useTheme } from '../hooks/useTheme';
export const ThemeContext = React.createContext(undefined);
export const ThemeProvider = ({ children }) => {
    const themeHook = useTheme();
    return (_jsx(ThemeContext.Provider, { value: themeHook, children: children }));
};
export const useThemeContext = () => {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};
