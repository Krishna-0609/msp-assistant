import React from 'react';
export const useTheme = () => {
    const [theme, setTheme] = React.useState(() => {
        const stored = localStorage.getItem('theme');
        return stored || 'system';
    });
    const [isDark, setIsDark] = React.useState(() => {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return theme === 'dark';
    });
    const applyTheme = React.useCallback((newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'system') {
            const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(isDarkSystem);
            isDarkSystem
                ? document.documentElement.classList.add('dark')
                : document.documentElement.classList.remove('dark');
        }
        else {
            setIsDark(newTheme === 'dark');
            newTheme === 'dark'
                ? document.documentElement.classList.add('dark')
                : document.documentElement.classList.remove('dark');
        }
    }, []);
    const toggleTheme = React.useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }, [theme, applyTheme]);
    React.useEffect(() => {
        applyTheme(theme);
    }, []);
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                setIsDark(mediaQuery.matches);
                mediaQuery.matches
                    ? document.documentElement.classList.add('dark')
                    : document.documentElement.classList.remove('dark');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);
    return { theme, isDark, applyTheme, toggleTheme };
};
