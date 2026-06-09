import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    GROW: 'bg-green-100 text-green-800',
    MAINTAIN: 'bg-blue-100 text-blue-800',
    SWAP: 'bg-yellow-100 text-yellow-800',
    REDUCE: 'bg-red-100 text-red-800',
  };

  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
