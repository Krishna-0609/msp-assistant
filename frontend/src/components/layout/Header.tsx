import React from 'react';
import { Button } from '../common/Button';

interface HeaderProps {
  onThemeToggle?: () => void;
  isDark?: boolean;
  notificationCount?: number;
  userInitials?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onThemeToggle,
  isDark = false,
  notificationCount = 0,
  userInitials = 'UI',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-dark-bg-secondary border-b border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="text-xl font-bold text-neutral-900 dark:text-dark-text-primary hidden sm:inline">
            MSP Assistant
          </span>
        </div>

        {/* Middle - Title */}
        <div className="flex-1 px-4 hidden md:block">
          <h1 className="text-lg font-semibold text-neutral-800 dark:text-dark-text-primary">
            Dashboard
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            className="relative p-2 text-neutral-600 dark:text-dark-text-secondary hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger-500 rounded-full">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          {onThemeToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="p-2"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.323 4.323a1 1 0 011.414 0l.707.707a1 1 0 00 1.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm13.323-5.677a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM15 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM4.323 15.677a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm6.657-4.323a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
                </svg>
              )}
            </Button>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-neutral-200 dark:border-neutral-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-neutral-900 dark:text-dark-text-primary">
                Welcome Back
              </p>
              <p className="text-xs text-neutral-500 dark:text-dark-text-tertiary">
                Account Admin
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{userInitials}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
