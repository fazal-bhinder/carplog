import React from 'react';

const Card = ({ children, className = '', onClick, ...props }) => {
  const interactive = Boolean(onClick);
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface border border-border rounded-xl
        shadow-[0_1px_3px_rgba(0,0,0,0.06)]
        ${interactive ? 'cursor-pointer hover:-translate-y-[1px] hover:shadow-md hover:border-border-dark transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
