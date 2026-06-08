import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow group ${className}`}>
      {children}
    </div>
  );
};

export default Card;
