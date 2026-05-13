import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Package, Tag,
  ChevronLeft, ChevronRight, Command,
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

// Sidebar color constants (dark charcoal theme)
const S = {
  bg: '#1C1917',
  border: '#292524',
  text: '#D6D3D1',    // always-visible nav text
  hover: '#292524',    // hover bg
  active: '#292524',    // active bg
  accent: '#C2692A',    // active icon + border
  muted: '#78716C',
};

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/catalogs', icon: BookOpen, label: 'Catalogs' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/categories', icon: Tag, label: 'Categories' },
];

// Carpet-weave SVG logo icon
const CarpLogIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="4" height="4" rx="1" fill={S.accent} />
    <rect x="7" y="1" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
    <rect x="13" y="1" width="4" height="4" rx="1" fill={S.accent} />
    <rect x="1" y="7" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
    <rect x="9" y="6" width="6" height="6" rx="1" fill={S.accent} />
    <rect x="17" y="7" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
    <rect x="1" y="13" width="4" height="4" rx="1" fill={S.accent} />
    <rect x="7" y="13" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
    <rect x="13" y="13" width="4" height="4" rx="1" fill={S.accent} />
  </svg>
);

const NavItem = ({ item, collapsed }) => {
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className="sidebar-nav-item block mx-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {({ isActive }) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '10px 12px',
            borderRadius: 8,
            borderLeft: `3px solid ${isActive ? S.accent : 'transparent'}`,
            background: isActive || hovered ? S.hover : 'transparent',
            transition: 'background 150ms, border-color 150ms',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Icon
            style={{
              width: 18,
              height: 18,
              flexShrink: 0,
              color: isActive ? S.accent : S.text,
              transition: 'color 150ms',
            }}
          />
          {!collapsed && (
            <span style={{
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#ffffff' : S.text,
              transition: 'color 150ms',
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          )}
          {/* CSS tooltip in collapsed mode */}
          {collapsed && (
            <span className="sidebar-tooltip">{item.label}</span>
          )}
        </div>
      )}
    </NavLink>
  );
};

const SidebarInner = ({ collapsed, onToggle, onOpenPalette }) => {
  const [cmdHovered, setCmdHovered] = useState(false);
  const [toggleHovered, setToggleHovered] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: S.bg }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 10,
        padding: '0 16px',
        height: 64,
        flexShrink: 0,
        borderBottom: 'none',
      }}>
        <span> </span><CarpLogIcon size={22} />
        {!collapsed && (
          <span style={{ color: '#ffffff', fontSize: 17, letterSpacing: '-0.3px' }}>
            <span style={{ fontWeight: 700 }}>Carp</span>
            <span style={{ fontWeight: 300 }}>Log</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ flexShrink: 0, borderTop: 'none', paddingBottom: 8 }}>
        {/* Cmd+K hint */}
        <button
          onClick={onOpenPalette}
          onMouseEnter={() => setCmdHovered(true)}
          onMouseLeave={() => setCmdHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8,
            margin: '8px 8px 2px',
            padding: '8px 12px',
            borderRadius: 8,
            background: cmdHovered ? S.hover : 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: 'calc(100% - 16px)',
            transition: 'background 150ms',
          }}
          className="sidebar-nav-item"
        >
          <Command style={{ width: 15, height: 15, flexShrink: 0, color: S.muted }} />
          {!collapsed && (
            <>
              <span style={{ fontSize: 12, color: S.muted, flex: 1, textAlign: 'left' }}>Quick actions</span>
              <span style={{ fontSize: 11, color: S.muted, fontFamily: 'monospace' }}>⌘K</span>
            </>
          )}
          {collapsed && <span className="sidebar-tooltip">Quick actions (⌘K)</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          onMouseEnter={() => setToggleHovered(true)}
          onMouseLeave={() => setToggleHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8,
            margin: '0 8px',
            padding: '8px 12px',
            borderRadius: 8,
            background: toggleHovered ? S.hover : 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: 'calc(100% - 16px)',
            transition: 'background 150ms',
          }}
        >
          {collapsed
            ? <ChevronRight style={{ width: 15, height: 15, color: S.muted }} />
            : <>
              <ChevronLeft style={{ width: 15, height: 15, color: S.muted, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: S.muted }}>Collapse</span>
            </>
          }
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, openCommandPalette } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const width = sidebarCollapsed ? 64 : 240;

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <aside
        className="hidden md:block"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100%',
          width,
          transition: `width 250ms ease`,
          background: S.bg,
          borderRight: `1px solid ${S.border}`,
          zIndex: 30,
          overflow: 'hidden',
        }}
      >
        <SidebarInner
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenPalette={openCommandPalette}
        />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 50,
          width: 36,
          height: 36,
          borderRadius: 8,
          background: S.bg,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        onClick={() => setMobileOpen(true)}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="4" height="4" rx="1" fill={S.accent} />
          <rect x="7" y="1" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
          <rect x="13" y="1" width="4" height="4" rx="1" fill={S.accent} />
          <rect x="1" y="7" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
          <rect x="9" y="6" width="6" height="6" rx="1" fill={S.accent} />
          <rect x="17" y="7" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
          <rect x="1" y="13" width="4" height="4" rx="1" fill={S.accent} />
          <rect x="7" y="13" width="4" height="4" rx="1" fill={S.text} opacity="0.6" />
          <rect x="13" y="13" width="4" height="4" rx="1" fill={S.accent} />
        </svg>
      </button>

      {/* Mobile overlay drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden"
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'transparent' }}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="md:hidden"
            style={{
              position: 'fixed',
              left: 0,
              top: 0,
              height: '100%',
              width: 240,
              zIndex: 50,
              background: S.bg,
              animation: 'page-enter 250ms ease',
            }}
          >
            <SidebarInner
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              onOpenPalette={() => { openCommandPalette(); setMobileOpen(false); }}
            />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
