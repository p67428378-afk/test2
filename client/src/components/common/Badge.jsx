import React from 'react';

export default function Badge({ text }) {
  const styles = {
    GROW: 'text-[#146c2e] bg-[#e6f4ea]',
    MAINTAIN: 'text-[#005a9e] bg-[#e1f0fa]',
    SWAP: 'text-[#b05c00] bg-[#fff0d4]',
    REDUCE: 'text-[#a50e0e] bg-[#fce8e8]',
  };

  const currentStyle = styles[text.toUpperCase()] || 'text-secondary bg-surface-container-high';

  return (
    <span className={`inline-block px-3 py-1 rounded-full font-label-bold text-label-bold ${currentStyle}`}>
      {text.toUpperCase()}
    </span>
  );
}
