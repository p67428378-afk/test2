import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/api';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ guestName: '', roomNumber: '', status: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings(filters);
        setBookings(response.data.bookings);
      } catch (err) {
        setError('Failed to fetch bookings.');
        console.error(err);
      }
    };

    fetchBookings();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Bookings</h2>
      <div className='mb-4 flex space-x-4'>
        <input
          type='text'
          name='guestName'
          value={filters.guestName}
          onChange={handleFilterChange}
          placeholder='Guest Name'
          className='p-2 border rounded'
        />
        <input
          type='text'
          name='roomNumber'
          value={filters.roomNumber}
          onChange={handleFilterChange}
          placeholder='Room Number'
          className='p-2 border rounded'
        />
        <select
          name='status'
          value={filters.status}
          onChange={handleFilterChange}
          className='p-2 border rounded'
        >
          <option value=''>All Statuses</option>
          <option value='pending'>Pending</option>
          <option value='confirmed'>Confirmed</option>
          <option value='cancelled'>Cancelled</option>
        </select>
      </div>
      <div className='bg-white p-4 rounded-lg shadow'>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='text-left'>Guest</th>
              <th className='text-left'>Room</th>
              <th className='text-left'>Check-in</th>
              <th className='text-left'>Check-out</th>
              <th className='text-left'>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.guestName}</td>
                <td>{booking.roomNumber}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
