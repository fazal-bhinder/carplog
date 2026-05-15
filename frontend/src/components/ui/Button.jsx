import React from 'react';

const variants = {
  primary:   'bg-accent text-white hover:bg-accent-hover active:scale-[0.98]',
  secondary: 'bg-surface text-body border border-border hover:border-border-dark hover:bg-surface-alt',
  ghost:     'text-body hover:bg-surface-alt border border-transparent',
  danger:    'bg-danger-bg text-danger border border-danger/20 hover:bg-red-100',
};

const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 
        px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-150 ease-in-out
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : children}
    </button>
  );
};

export default Button;
