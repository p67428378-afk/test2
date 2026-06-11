import React, { useState, useEffect } from 'react';
import BookingsTabs from '../components/bookings/BookingsTabs.jsx';
import BookingCard from '../components/bookings/BookingCard.jsx';
import { bookingService } from '../services/api.js';

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelLoading(bookingId);
    setError('');
    setSuccessMessage('');
    try {
      await bookingService.cancelBooking(bookingId);
      setSuccessMessage('Booking cancelled successfully.');
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  };

  const isUpcoming = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) >= today;
  };

  const filteredBookings = bookings.filter((booking) => {
    const upcoming = isUpcoming(booking.booking_date);
    return activeTab === 'upcoming' ? upcoming : !upcoming;
  });

  return (
    <div className='bg-surface-override border border-outline-override rounded-lg p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15)]'>
      <div className='mb-6'>
        <h3 className='font-semibold text-xl text-white'>My Bookings</h3>
        <p className='text-sm text-on-surface-variant mt-1'>Manage your upcoming and past workspace reservations.</p>
      </div>

      <BookingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Notifications / Messages */}
      {error && (
        <div className='bg-rose-override/10 border border-rose-override/20 text-rose-override px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-6'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className='bg-emerald-override/10 border border-emerald-override/20 text-emerald-override px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-6'>
          <span className='material-symbols-outlined'>check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-override'></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className='text-center py-12 text-on-surface-variant'>
          <span className='material-symbols-outlined text-4xl mb-2 block'>calendar_today</span>
          <p className='text-sm'>No {activeTab} bookings found.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
              cancelLoading={cancelLoading === booking.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}