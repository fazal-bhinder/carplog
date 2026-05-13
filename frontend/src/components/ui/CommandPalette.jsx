import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, BookOpen, Tag, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const actions = [
  { label: 'Add Product',   icon: Plus,     href: '/products/new',  hint: 'Create a new product' },
  { label: 'New Catalog',   icon: BookOpen,  href: '/catalogs',     hint: 'Go to catalogs' },
  { label: 'Add Category',  icon: Tag,       href: '/categories',   hint: 'Manage categories' },
];

const CommandPalette = () => {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, closeCommandPalette } = useAppStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (!isCommandPaletteOpen) return;
      if (e.key === 'Escape') closeCommandPalette();
      if (e.key === 'ArrowDown') setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === 'ArrowUp') setSelected((s) => Math.max(s - 1, 0));
      if (e.key === 'Enter' && filtered[selected]) {
        navigate(filtered[selected].href);
        closeCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isCommandPaletteOpen, selected, filtered, navigate, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh]"
      style={{ background: 'transparent' }}
      onClick={closeCommandPalette}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl shadow-2xl overflow-hidden"
        style={{ background: '#1C1917', border: '1px solid #292524' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: '#292524' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#78716C' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search actions…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: '#D6D3D1', border: 'none', boxShadow: 'none' }}
          />
          <button onClick={closeCommandPalette} className="hover:opacity-60 transition-opacity">
            <X className="w-4 h-4" style={{ color: '#78716C' }} />
          </button>
        </div>

        {/* Actions list */}
        <div className="py-2 max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: '#78716C' }}>No actions found</p>
          ) : (
            filtered.map((action, i) => {
              const Icon = action.icon;
              const isActive = i === selected;
              return (
                <button
                  key={action.label}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => { navigate(action.href); closeCommandPalette(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{
                    background: isActive ? '#292524' : 'transparent',
                    color: isActive ? '#ffffff' : '#D6D3D1',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isActive ? '#C2692A' : '#292524' }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs" style={{ color: '#78716C' }}>{action.hint}</p>
                  </div>
                  {isActive && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: '#292524', color: '#78716C', border: '1px solid #3d3a37' }}>
                      ↵
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t flex gap-4 text-xs" style={{ borderColor: '#292524', color: '#78716C' }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
