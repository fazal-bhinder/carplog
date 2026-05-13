import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const icons = {
  success: <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />,
  error:   <XCircle    className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-danger)' }} />,
  warning: <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />,
  loading: <Loader     className="w-4 h-4 flex-shrink-0 animate-spin" style={{ color: 'var(--color-accent)' }} />,
};

const borderColors = {
  success: 'var(--color-success)',
  error:   'var(--color-danger)',
  warning: 'var(--color-warning)',
  loading: 'var(--color-accent)',
};

const Toast = ({ toast }) => {
  const removeToast = useAppStore((s) => s.removeToast);

  return (
    <div
      className="toast-enter flex items-start gap-3 bg-surface border border-border rounded-xl px-4 py-3 shadow-lg min-w-[300px] max-w-[380px] relative"
      style={{ borderLeft: `3px solid ${borderColors[toast.type] || borderColors.success}` }}
    >
      {icons[toast.type] || icons.success}
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-sm font-semibold text-ink">{toast.title}</p>}
        {toast.message && <p className="text-xs text-muted mt-0.5">{toast.message}</p>}
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-muted hover:text-ink transition-colors ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useAppStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
