import React from 'react';

export default function HistoryItem({ calculation }) {
  const { formula, result, status, created_at } = calculation;

  // Simple relative time formatter or fallback to locale string
  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return 'Just now';
      if (diffMins === 1) return '1 min ago';
      if (diffMins < 60) return `${diffMins} mins ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;

      return date.toLocaleDateString();
    } catch (e) {
      return 'Some time ago';
    }
  };

  const isError = status === 'error' || result === null;

  return (
    <div className='history-item'>
      <div>
        <div className='text-on-surface-variant text-sm mb-1'>{formula}</div>
        <div className={`font-bold font-label-md text-label-md ${isError ? 'text-error' : 'text-secondary-container'}`}>
          = {isError ? 'Error' : result}
        </div>
      </div>
      <div className='text-xs text-on-surface-variant/70'>{formatTime(created_at)}</div>
    </div>
  );
}