import React, { useState, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const KebabMenu = ({ items = [] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg bg-surface border border-border hover:border-border-dark transition-all shadow-sm"
        title="More actions"
      >
        <MoreHorizontal className="w-4 h-4 text-muted" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden min-w-[160px]"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => { item.onClick(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors hover:bg-surface-alt ${
                  item.danger ? 'text-danger hover:bg-danger-bg' : 'text-body'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KebabMenu;
