import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../ui/Toast';
import useAppStore from '../../store/useAppStore';

const PageWrapper = ({ children }) => {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const sidebarW = sidebarCollapsed ? 64 : 240;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <Navbar />

      <main
        className="pt-16 min-h-screen"
        style={{
          marginLeft: sidebarW,
          transition: `margin-left 250ms ease`,
        }}
      >
        <div className="p-6 md:p-8 page-enter">
          {children}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
};

export default PageWrapper;
