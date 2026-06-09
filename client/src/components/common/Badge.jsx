import React from 'react';

const Badge = ({ status, className = '' }) => {
  const styles = {
    GROW: 'bg-green-status/15 text-green-status border-green-status/30',
    MAINTAIN: 'bg-blue-status/15 text-blue-status border-blue-status/30',
    SWAP: 'bg-primary-container/15 text-primary-container border-primary-container/30',
    REDUCE: 'bg-red-status/15 text-red-status border-red-status/30',
  };

  const currentStyle = styles[status] || 'bg-surface-variant text-on-surface border-outline-variant/30';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}>
      {status}
    </span>
  );
};

export default Badge;
