import React from 'react';

export default function StatusBadge({ status }) {
  const normalizedStatus = (status || '').toUpperCase();

  let classes = 'bg-slate-100 text-slate-800 border-slate-200';
  if (normalizedStatus === 'GROW') {
    classes = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (normalizedStatus === 'MAINTAIN') {
    classes = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (normalizedStatus === 'REDUCE') {
    classes = 'bg-amber-100 text-amber-800 border-amber-200';
  } else if (normalizedStatus === 'SWAP') {
    classes = 'bg-red-100 text-red-800 border-red-200';
  }

  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${classes}`}>
      {status}
    </span>
  );
}
