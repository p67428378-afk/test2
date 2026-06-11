import React from 'react';

export default function BookingCard({ booking, onCancel, cancelLoading }) {
  const { id, booking_date, status, cubicle } = booking;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const isUpcoming = new Date(booking_date) >= new Date(new Date().setHours(0,0,0,0));

  return (
    <div className='bg-surface-override border border-outline-override rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15)]'>
      <div className='flex items-start gap-4'>
        <div className='p-3 bg-indigo-override/10 rounded-lg text-indigo-override'>
          <span className='material-symbols-outlined text-2xl'>desktop_windows</span>
        </div>
        <div>
          <div className='flex items-center gap-2 mb-1'>
            <h4 className='font-semibold text-lg text-white'>Cubicle {cubicle?.name || 'Unknown'}</h4>
            <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded tracking-wider ${
              status === 'confirmed' 
                ? 'bg-emerald-override/10 text-emerald-override' 
                : 'bg-rose-override/10 text-rose-override'
            }`}>
              {status}
            </span>
          </div>
          <p className='text-sm text-on-surface-variant mb-2'>{cubicle?.location || 'Unknown'}</p>
          <div className='flex items-center gap-2 text-xs text-slate-400'>
            <span className='material-symbols-outlined text-sm'>calendar_today</span>
            <span>{formatDate(booking_date)}</span>
          </div>
          {cubicle?.amenities && cubicle.amenities.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mt-3'>
              {cubicle.amenities.map((amenity, idx) => (
                <span key={idx} className='text-[10px] font-semibold bg-[#0F172A] text-on-surface-variant px-2 py-0.5 rounded border border-outline-override'>
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {isUpcoming && status === 'confirmed' && (
        <button
          onClick={() => onCancel(id)}
          disabled={cancelLoading}
          className='bg-rose-override/10 hover:bg-rose-override hover:text-white text-rose-override font-medium text-sm py-2 px-4 rounded-lg transition-all shrink-0 border border-rose-override/20 disabled:opacity-50'
        >
          {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}
    </div>
  );
}