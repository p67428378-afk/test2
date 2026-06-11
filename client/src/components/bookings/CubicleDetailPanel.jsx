import React from 'react';

export default function CubicleDetailPanel({ cubicle, selectedDate, onBook, bookingLoading }) {
  if (!cubicle) {
    return (
      <div className='lg:col-span-4 bg-surface-override border border-outline-override rounded-lg p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15)] sticky top-6 text-center py-12 text-on-surface-variant'>
        <span className='material-symbols-outlined text-4xl mb-2 block'>info</span>
        <p className='text-sm'>Select a cubicle from the floor plan to view details and book.</p>
      </div>
    );
  }

  const { name, location, amenities } = cubicle;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className='lg:col-span-4 bg-surface-override border border-outline-override rounded-lg p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15)] sticky top-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-lg text-white'>Cubicle {name}</h3>
        <span className='bg-emerald-override/10 text-emerald-override text-xs font-semibold uppercase px-2 py-1 rounded tracking-wider'>Available</span>
      </div>
      <p className='text-sm text-on-surface-variant mb-6 pb-6 border-b border-outline-override'>{location}</p>
      
      <div className='mb-6'>
        <h4 className='text-xs font-semibold text-white uppercase tracking-wider mb-4'>Amenities Included</h4>
        <ul className='flex flex-col gap-3'>
          {amenities.length === 0 ? (
            <li className='text-sm text-on-surface-variant italic'>No special amenities</li>
          ) : (
            amenities.map((amenity, idx) => (
              <li key={idx} className='flex items-start gap-3'>
                <span className='material-symbols-outlined text-indigo-override text-xl'>check_circle</span>
                <span className='text-sm text-on-surface-variant'>{amenity}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className='bg-[#0F172A] rounded-lg p-4 mb-6 border border-outline-override'>
        <div className='flex items-center gap-3 mb-2'>
          <span className='material-symbols-outlined text-on-surface-variant'>calendar_today</span>
          <h4 className='text-xs font-semibold text-white'>Booking Date</h4>
        </div>
        <p className='text-sm text-indigo-override font-medium pl-9'>
          {selectedDate === '2026-05-19' ? 'Tomorrow ' : ''}({formatDate(selectedDate)})
        </p>
      </div>

      <button 
        onClick={onBook}
        disabled={bookingLoading}
        className='w-full bg-indigo-override text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity mb-4 shadow-lg shadow-indigo-override/20 cursor-pointer active:scale-95 transition-transform disabled:opacity-50'
      >
        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
      </button>
      <p className='text-xs text-on-surface-variant text-center opacity-70'>
        A confirmation email and Slack notification will be sent instantly upon booking.
      </p>
    </div>
  );
}