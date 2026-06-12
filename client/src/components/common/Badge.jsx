import React from 'react';

export default function Badge({ status }) {
  const styles = {
    APPROVED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    REVIEW: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    FLAGGED: 'bg-error/10 text-error border border-error/20',
    PENDING: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/30',
    PASSED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    FAILED: 'bg-error/10 text-error border border-error/20',
    ERROR: 'bg-error/10 text-error border border-error/20',
    SUBMITTED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  const currentStyle = styles[status] || styles.PENDING;

  return (
    <span className={`px-2 py-1 rounded-sm font-label-md text-[10px] uppercase tracking-wider ${currentStyle}`}>
      {status}
    </span>
  );
}