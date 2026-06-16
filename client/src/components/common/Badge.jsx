import React from 'react';

export default function Badge({ status }) {
  const styles = {
    GROW: 'bg-green-900/50 text-green-400 border-green-800',
    MAINTAIN: 'bg-blue-900/50 text-blue-400 border-blue-800',
    SWAP: 'bg-amber-900/50 text-amber-400 border-amber-800',
    REDUCE: 'bg-red-900/50 text-red-400 border-red-800',
  };

  const currentStyle = styles[status] || 'bg-gray-900/50 text-gray-400 border-gray-800';

  return (
    <span className={`inline-block border text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
}
