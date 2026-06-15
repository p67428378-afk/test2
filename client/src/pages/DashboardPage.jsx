import React, { useState, useEffect } from 'react';
import RoomSearchPanel from '../components/reservations/RoomSearchPanel';
import RoomResultsTable from '../components/reservations/RoomResultsTable';
import SelectedRoomSummary from '../components/reservations/SelectedRoomSummary';
import ReservationForm from '../components/reservations/ReservationForm';
import { getRooms, createReservation, getReservations } from '../services/api';

export default function DashboardPage() {
  const [checkInDate, setCheckInDate] = useState('2026-07-10');
  const [checkOutDate, setCheckOutDate] = useState('2026-07-15');
  const [roomType, setRoomType] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    occupancyRate: '78%',
    activeBookings: 142,
    arrivalsToday: 18,
  });

  const fetchStats = async () => {
    try {
      const res = await getReservations();
      if (res && Array.isArray(res)) {
        setStats((prev) => ({
          ...prev,
          activeBookings: res.length,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setSelectedRoom(null);
    try {
      const data = await getRooms(checkInDate, checkOutDate, roomType);
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch available rooms. Please check your dates.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (guestDetails) => {
    if (!selectedRoom) return;
    setBookingLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const payload = {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        room_id: selectedRoom.id,
        ...guestDetails,
      };
      const res = await createReservation(payload);
      setSuccessMessage(`Reservation successfully created! Reservation ID: ${res.reservation_number || res.id}`);
      setSelectedRoom(null);
      // Refresh rooms list
      handleSearch();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create reservation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* KPI Row */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg border border-slate-border p-6 flex flex-col gap-2'>
          <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Occupancy Rate</span>
          <div className='flex items-baseline gap-3'>
            <span className='text-3xl font-bold text-slate-900'>{stats.occupancyRate}</span>
            <div className='flex items-center text-teal-dark text-sm bg-teal-50 px-2 py-0.5 rounded'>
              <span className='material-symbols-outlined text-sm'>trending_up</span>
              <span>+2.4%</span>
            </div>
          </div>
          <span className='text-xs text-slate-500 mt-1'>vs yesterday</span>
        </div>
        <div className='bg-white rounded-lg border border-slate-border p-6 flex flex-col gap-2'>
          <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Active Bookings</span>
          <div className='flex items-baseline gap-3'>
            <span className='text-3xl font-bold text-slate-900'>{stats.activeBookings}</span>
          </div>
          <span className='text-xs text-slate-500 mt-1'>+12 this week</span>
        </div>
        <div className='bg-white rounded-lg border border-slate-border p-6 flex flex-col gap-2'>
          <span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>Arrivals Today</span>
          <div className='flex items-baseline gap-3'>
            <span className='text-3xl font-bold text-slate-900'>{stats.arrivalsToday}</span>
          </div>
          <span className='text-xs text-amber-alert mt-1 font-medium'>5 checked in</span>
        </div>
      </section>

      {/* Notifications */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2'>
          <span className='material-symbols-outlined text-lg'>error</span>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className='bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md text-sm flex items-center gap-2'>
          <span className='material-symbols-outlined text-lg'>check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Search Panel */}
      <RoomSearchPanel
        checkInDate={checkInDate}
        setCheckInDate={setCheckInDate}
        checkOutDate={checkOutDate}
        setCheckOutDate={setCheckOutDate}
        roomType={roomType}
        setRoomType={setRoomType}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Results & Booking Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <RoomResultsTable
            rooms={rooms}
            onSelectRoom={setSelectedRoom}
            selectedRoomId={selectedRoom?.id}
          />
        </div>
        <div className='space-y-6'>
          <SelectedRoomSummary
            selectedRoom={selectedRoom}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
          />
          {selectedRoom && (
            <ReservationForm
              onSubmit={handleBooking}
              selectedRoom={selectedRoom}
              loading={bookingLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
