import React from 'react';

const Card = ({ title, children, className = '', ...props }) => {
  return (
    <div className={`bg-surface-container rounded-lg p-6 border border-outline-variant/30 flex flex-col justify-between ${className}`} {...props}>
      {title && <p className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2'>{title}</p>}
      {children}
    </div>
  );
};

export default Card;
