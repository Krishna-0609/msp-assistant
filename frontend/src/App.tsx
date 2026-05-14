import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Costs from './pages/Costs';
import Reports from './pages/Reports';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

import './styles/globals.css';
import './styles/animations.css';
import './styles/theme.css';
import './styles/utilities.css';

const AppContent = () => {
  const { isDark, toggleTheme } = useThemeContext();
  const { isAuthenticated, user, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const sidebarItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4v4" />
        </svg>
      ),
      label: 'Dashboard',
      href: '/dashboard',
      active: window.location.pathname === '/dashboard',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Costs',
      href: '/costs',
      active: window.location.pathname === '/costs',
      badge: 2,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Reports',
      href: '/reports',
      active: window.location.pathname === '/reports',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Chat',
      href: '/chat',
      active: window.location.pathname === '/chat',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      label: 'Admin',
      href: '/admin',
      active: window.location.pathname === '/admin',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout
                headerProps={{
                  onThemeToggle: toggleTheme,
                  isDark,
                  notificationCount: 3,
                  userInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UI',
                }}
                sidebarProps={{
                  items: sidebarItems,
                }}
              >
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/costs"
          element={
            <ProtectedRoute>
              <MainLayout
                headerProps={{
                  onThemeToggle: toggleTheme,
                  isDark,
                  notificationCount: 3,
                  userInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UI',
                }}
                sidebarProps={{
                  items: sidebarItems,
                }}
              >
                <Costs />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout
                headerProps={{
                  onThemeToggle: toggleTheme,
                  isDark,
                  notificationCount: 3,
                  userInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UI',
                }}
                sidebarProps={{
                  items: sidebarItems,
                }}
              >
                <Reports />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <MainLayout
                headerProps={{
                  onThemeToggle: toggleTheme,
                  isDark,
                  notificationCount: 3,
                  userInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UI',
                }}
                sidebarProps={{
                  items: sidebarItems,
                }}
              >
                <Chat />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout
                headerProps={{
                  onThemeToggle: toggleTheme,
                  isDark,
                  notificationCount: 3,
                  userInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'UI',
                }}
                sidebarProps={{
                  items: sidebarItems,
                }}
              >
                <Admin />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
