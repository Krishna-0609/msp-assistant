import React from 'react';
import { Header, type HeaderProps } from './Header';
import { Sidebar, type SidebarProps } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  headerProps?: Partial<HeaderProps>;
  sidebarProps?: Partial<SidebarProps>;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  headerProps = {},
  sidebarProps = {},
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg-primary">
      <Header {...headerProps} />

      <div className="flex">
        <Sidebar
          {...(sidebarProps as any)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 bg-neutral-50 dark:bg-dark-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
};
