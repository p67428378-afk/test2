import React, { useState } from 'react';

export default function ReservationForm({ onSubmit, selectedRoom, loading }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      guest: {
        full_name: fullName,
        email,
        phone_number: phoneNumber,
      },
      number_of_guests: parseInt(numberOfGuests, 10),
      estimated_arrival_time: estimatedArrivalTime || null,
    });
  };

  return (
    <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm'>
      <h3 className='text-lg font-semibold text-on-surface mb-4'>Guest &amp; Booking Details</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
              Guest Full Name
            </label>
            <input
              className='w-full px-4 py-2 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='text'
              placeholder='John Doe'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
              Guest Email
            </label>
            <input
              className='w-full px-4 py-2 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='email'
              placeholder='john.doe@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
              Phone Number
            </label>
            <input
              className='w-full px-4 py-2 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='tel'
              placeholder='+1 (555) 000-0000'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
              Number of Guests
            </label>
            <input
              className='w-full px-4 py-2 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='number'
              min='1'
              max='10'
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
              Estimated Arrival Time
            </label>
            <input
              className='w-full px-4 py-2 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
              type='text'
              placeholder='e.g. 14:00'
              value={estimatedArrivalTime}
              onChange={(e) => setEstimatedArrivalTime(e.target.value)}
            />
          </div>
        </div>

        <div className='pt-4'>
          <button
            type='submit'
            disabled={loading || !selectedRoom}
            className='w-full bg-teal-dark hover:bg-primary-container text-white text-sm font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50'
          >
            <span className='material-symbols-outlined text-lg'>check_circle</span>
            {loading ? 'Creating Booking...' : 'Confirm Reservation'}
          </button>
        </div>
      </form>
    </section>
  );
}
