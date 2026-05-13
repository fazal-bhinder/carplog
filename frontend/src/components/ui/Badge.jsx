import React from 'react';

const styles = {
  live:    'bg-success-bg text-success border border-success/20',
  draft:   'bg-surface-alt text-muted border border-border',
  success: 'bg-success-bg text-success border border-success/20',
  warning: 'bg-warning-bg text-warning border border-warning/20',
  danger:  'bg-danger-bg text-danger border border-danger/20',
  accent:  'bg-accent-light text-accent border border-accent/20',
  neutral: 'bg-surface-alt text-body border border-border',
};

const Badge = ({ children, status, className = '' }) => {
  const style = styles[status] || styles.neutral;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>
      {(status === 'live' || status === 'success') && (
        <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
      )}
      {children}
    </span>
  );
};

export default Badge;
