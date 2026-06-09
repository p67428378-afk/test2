import React from 'react';

export default function Badge({ status }) {
  const styles = {
    GROW: 'bg-green-100 text-green-800',
    MAINTAIN: 'bg-blue-100 text-blue-800',
    SWAP: 'bg-amber-100 text-amber-800',
    REDUCE: 'bg-red-100 text-red-800',
  };

  const style = styles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold w-24 ${style}`}>
      {status}
    </span>
  );
}
