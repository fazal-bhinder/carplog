import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Command } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const pageTitles = {
  '/':                  'Dashboard',
  '/catalogs':          'Catalogs',
  '/products':          'Products',
  '/products/new':      'Add Product',
  '/categories':        'Categories',
};

const Navbar = () => {
  const location = useLocation();
  const { sidebarCollapsed, openCommandPalette } = useAppStore();

  const title = pageTitles[location.pathname]
    ?? (location.pathname.includes('/catalogs/') ? 'Catalog Detail'
      : location.pathname.includes('/products/') ? 'Edit Product'
      : 'CarpLog');

  const sidebarW = sidebarCollapsed ? 64 : 240;

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between px-6 h-16"
      style={{
        left: sidebarW,
        transition: `left 250ms ease`,
        background: 'rgba(250,250,248,0.90)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <h1 className="text-[17px] font-semibold text-ink">{title}</h1>

      <button
        onClick={openCommandPalette}
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted text-sm hover:border-border-dark hover:text-body transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Search…</span>
        <span className="flex items-center gap-0.5 text-xs ml-2 font-mono">
          <Command className="w-3 h-3" />K
        </span>
      </button>
    </header>
  );
};

export default Navbar;
