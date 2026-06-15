import React from 'react';

export default function RoomSearchPanel({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  roomType,
  setRoomType,
  onSearch,
  loading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-on-surface mb-4'>Find Available Rooms</h3>
      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
            Check-in Date
          </label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-lg'>
              calendar_today
            </span>
            <input
              className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='date'
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
            Check-out Date
          </label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-lg'>
              calendar_today
            </span>
            <input
              className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='date'
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
            Room Type
          </label>
          <div className='relative'>
            <select
              className='w-full pl-4 pr-10 py-2.5 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark appearance-none transition-colors cursor-pointer'
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value=''>All Types</option>
              <option value='Single'>Single Room</option>
              <option value='Double'>Double Room</option>
              <option value='Suite'>King Suite</option>
            </select>
            <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none'>
              expand_more
            </span>
          </div>
        </div>
        <div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-teal-dark hover:bg-primary-container text-white text-sm font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50'
          >
            <span className='material-symbols-outlined text-lg'>search</span>
            {loading ? 'Searching...' : 'Search Availability'}
          </button>
        </div>
      </form>
    </section>
  );
}
