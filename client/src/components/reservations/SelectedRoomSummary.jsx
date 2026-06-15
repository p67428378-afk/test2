import React from 'react';

export default function SelectedRoomSummary({ selectedRoom, checkInDate, checkOutDate }) {
  if (!selectedRoom) {
    return (
      <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[200px]'>
        <span className='material-symbols-outlined text-slate-300 text-4xl mb-2'>bed</span>
        <p className='text-sm text-slate-500'>No room selected yet. Select a room from the search results to view summary.</p>
      </section>
    );
  }

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * parseFloat(selectedRoom.price_per_night);

  return (
    <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm h-full flex flex-col justify-between'>
      <div>
        <h3 className='text-lg font-semibold text-on-surface mb-4'>Selected Room Summary</h3>
        <div className='space-y-3'>
          <div className='flex justify-between border-b border-slate-100 pb-2'>
            <span className='text-sm text-slate-500'>Room Number</span>
            <span className='text-sm font-semibold text-on-surface'>Room {selectedRoom.room_number}</span>
          </div>
          <div className='flex justify-between border-b border-slate-100 pb-2'>
            <span className='text-sm text-slate-500'>Room Type</span>
            <span className='text-sm font-semibold text-on-surface'>{selectedRoom.room_type}</span>
          </div>
          <div className='flex justify-between border-b border-slate-100 pb-2'>
            <span className='text-sm text-slate-500'>Check-in</span>
            <span className='text-sm font-semibold text-on-surface'>{checkInDate}</span>
          </div>
          <div className='flex justify-between border-b border-slate-100 pb-2'>
            <span className='text-sm text-slate-500'>Check-out</span>
            <span className='text-sm font-semibold text-on-surface'>{checkOutDate}</span>
          </div>
          <div className='flex justify-between border-b border-slate-100 pb-2'>
            <span className='text-sm text-slate-500'>Nights</span>
            <span className='text-sm font-semibold text-on-surface'>{nights}</span>
          </div>
        </div>
      </div>
      <div className='mt-6 pt-4 border-t border-slate-border flex justify-between items-baseline'>
        <span className='text-sm font-semibold text-slate-600'>Total Price</span>
        <span className='text-2xl font-bold text-teal-dark'>${totalPrice.toFixed(2)}</span>
      </div>
    </section>
  );
}
