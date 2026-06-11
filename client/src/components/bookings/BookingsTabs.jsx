import React from 'react';

export default function BookingsTabs({ activeTab, setActiveTab }) {
  return (
    <div className='flex border-b border-outline-override mb-6'>
      <button
        onClick={() => setActiveTab('upcoming')}
        className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
          activeTab === 'upcoming'
            ? 'border-indigo-override text-white'
            : 'border-transparent text-on-surface-variant hover:text-white'
        }`}
      >
        Upcoming Bookings
      </button>
      <button
        onClick={() => setActiveTab('past')}
        className={`px-6 py-3 font-medium text-sm border-b-2 transition-all ${
          activeTab === 'past'
            ? 'border-indigo-override text-white'
            : 'border-transparent text-on-surface-variant hover:text-white'
        }`}
      >
        Past Bookings
      </button>
    </div>
  );
}