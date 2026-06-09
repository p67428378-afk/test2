import React from 'react';

export default function Badge({ status }) {
  const styles = {
    GROW: 'bg-emerald-600 text-white',
    MAINTAIN: 'bg-slate-600 text-white',
    SWAP: 'bg-[#F59E0B] text-black',
    REDUCE: 'bg-rose-700 text-white',
  };

  const currentStyle = styles[status?.toUpperCase()] || 'bg-slate-600 text-white';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${currentStyle}`}>
      {status}
    </span>
  );
}
