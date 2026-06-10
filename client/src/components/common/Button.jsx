import React from 'react';

export default function Button({ children, onClick, className = '', colSpan = 1 }) {
  const colSpanClass = colSpan === 2 ? 'col-span-2' : '';
  return (
    <button
      onClick={onClick}
      className={`mathflow-button rounded-lg font-button-label text-button-label py-4 transition-colors ${colSpanClass} ${className}`}
    >
      {children}
    </button>
  );
}