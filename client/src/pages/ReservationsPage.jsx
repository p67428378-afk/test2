import React, { useState, useEffect } from 'react';
import { getReservations, getReservation, updateReservation } from '../services/api';

export default function ReservationsPage() {
  const [search, setSearch] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Edit form state
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editGuests, setEditCheckGuests] = useState(1);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editArrival, setEditArrival] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getReservations(search);
      setReservations(data);
    } catch (err) {
      setError('Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleSelectReservation = async (resId) => {
    setError('');
    setSuccessMessage('');
    setIsEditing(false);
    try {
      const details = await getReservation(resId);
      setSelectedReservation(details);
      // Populate edit state
      setEditCheckIn(details.check_in_date);
      setEditCheckOut(details.check_out_date);
      setEditCheckGuests(details.number_of_guests);
      setEditName(details.guest?.full_name || '');
      setEditEmail(details.guest?.email || '');
      setEditPhone(details.guest?.phone_number || '');
      setEditArrival(details.estimated_arrival_time || '');
    } catch (err) {
      setError('Failed to fetch reservation details.');
    }
  };

  const handleUpdateReservation = async (e) => {
    e.preventDefault();
    if (!selectedReservation) return;
    setError('');
    setSuccessMessage('');
    try {
      const payload = {
        check_in_date: editCheckIn,
        check_out_date: editCheckOut,
        number_of_guests: parseInt(editGuests, 10),
        estimated_arrival_time: editArrival || null,
        guest: {
          full_name: editName,
          email: editEmail,
          phone_number: editPhone,
        },
      };
      const updated = await updateReservation(selectedReservation.id, payload);
      setSelectedReservation(updated);
      setSuccessMessage('Reservation successfully updated!');
      setIsEditing(false);
      fetchReservations();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update reservation.');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-xl font-bold text-slate-900'>Reservation Lookup &amp; Management</h3>
      </div>

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

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Search & List */}
        <div className='lg:col-span-2 space-y-4'>
          <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm'>
            <form onSubmit={handleSearchSubmit} className='flex gap-3'>
              <div className='relative flex-1'>
                <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg'>
                  search
                </span>
                <input
                  className='w-full pl-10 pr-4 py-2 bg-white border border-slate-border rounded-md text-sm focus:outline-none focus:border-teal-dark focus:ring-1 focus:ring-teal-dark transition-colors'
                  placeholder="Search by guest's last name or reservation ID..."
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type='submit'
                className='bg-teal-dark hover:bg-primary-container text-white text-sm font-medium px-6 py-2 rounded-md transition-colors'
              >
                Search
              </button>
            </form>
          </section>

          <section className='bg-white rounded-lg border border-slate-border overflow-hidden shadow-sm'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-slate-50 border-b border-slate-border text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                    <th className='px-6 py-4'>Reservation ID</th>
                    <th className='px-6 py-4'>Guest Name</th>
                    <th className='px-6 py-4'>Dates</th>
                    <th className='px-6 py-4'>Status</th>
                    <th className='px-6 py-4 text-right'>Action</th>
                  </tr>
                </thead>
                <tbody className='text-sm text-on-surface'>
                  {loading ? (
                    <tr>
                      <td colSpan='5' className='px-6 py-8 text-center text-slate-500'>
                        Loading reservations...
                      </td>
                    </tr>
                  ) : reservations.length === 0 ? (
                    <tr>
                      <td colSpan='5' className='px-6 py-8 text-center text-slate-500'>
                        No reservations found.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((res) => (
                      <tr
                        key={res.id}
                        className={`border-b border-slate-border hover:bg-slate-50 transition-colors ${
                          selectedReservation?.id === res.id ? 'bg-teal-50/50' : ''
                        }`}
                      >
                        <td className='px-6 py-4 font-medium'>{res.reservation_number || res.id.substring(0, 8)}</td>
                        <td className='px-6 py-4'>{res.guest?.full_name}</td>
                        <td className='px-6 py-4 text-xs text-slate-500'>
                          {res.check_in_date} to {res.check_out_date}
                        </td>
                        <td className='px-6 py-4'>
                          <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100'>
                            {res.status || 'Confirmed'}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <button
                            onClick={() => handleSelectReservation(res.id)}
                            className='text-teal-dark hover:underline font-medium'
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Column: Details & Edit */}
        <div>
          {selectedReservation ? (
            <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm space-y-4'>
              <div className='flex justify-between items-center border-b border-slate-100 pb-3'>
                <h4 className='font-bold text-slate-900'>Reservation Details</h4>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className='text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-medium transition-colors'
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateReservation} className='space-y-3'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-semibold text-slate-500 uppercase'>Guest Name</label>
                    <input
                      className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                      type='text'
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-semibold text-slate-500 uppercase'>Email</label>
                    <input
                      className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                      type='email'
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-xs font-semibold text-slate-500 uppercase'>Phone</label>
                    <input
                      className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                      type='text'
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-xs font-semibold text-slate-500 uppercase'>Check-in</label>
                      <input
                        className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                        type='date'
                        value={editCheckIn}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-xs font-semibold text-slate-500 uppercase'>Check-out</label>
                      <input
                        className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                        type='date'
                        value={editCheckOut}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='flex flex-col gap-1'>
                      <label className='text-xs font-semibold text-slate-500 uppercase'>Guests</label>
                      <input
                        className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                        type='number'
                        min='1'
                        value={editGuests}
                        onChange={(e) => setEditCheckGuests(e.target.value)}
                        required
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label className='text-xs font-semibold text-slate-500 uppercase'>Arrival Time</label>
                      <input
                        className='w-full px-3 py-1.5 border border-slate-border rounded text-sm'
                        type='text'
                        value={editArrival}
                        onChange={(e) => setEditArrival(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type='submit'
                    className='w-full bg-teal-dark hover:bg-primary-container text-white text-sm font-medium py-2 rounded transition-colors'
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className='space-y-3 text-sm'>
                  <div>
                    <span className='text-xs text-slate-500 block'>Reservation ID</span>
                    <span className='font-semibold text-slate-900'>{selectedReservation.reservation_number || selectedReservation.id}</span>
                  </div>
                  <div>
                    <span className='text-xs text-slate-500 block'>Guest Name</span>
                    <span className='font-semibold text-slate-900'>{selectedReservation.guest?.full_name}</span>
                  </div>
                  <div>
                    <span className='text-xs text-slate-500 block'>Email</span>
                    <span className='text-slate-900'>{selectedReservation.guest?.email}</span>
                  </div>
                  <div>
                    <span className='text-xs text-slate-500 block'>Phone</span>
                    <span className='text-slate-900'>{selectedReservation.guest?.phone_number}</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <span className='text-xs text-slate-500 block'>Check-in</span>
                      <span className='font-semibold text-slate-900'>{selectedReservation.check_in_date}</span>
                    </div>
                    <div>
                      <span className='text-xs text-slate-500 block'>Check-out</span>
                      <span className='font-semibold text-slate-900'>{selectedReservation.check_out_date}</span>
                    </div>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <div>
                      <span className='text-xs text-slate-500 block'>Guests</span>
                      <span className='font-semibold text-slate-900'>{selectedReservation.number_of_guests}</span>
                    </div>
                    <div>
                      <span className='text-xs text-slate-500 block'>Arrival Time</span>
                      <span className='font-semibold text-slate-900'>{selectedReservation.estimated_arrival_time || 'Not specified'}</span>
                    </div>
                  </div>
                  <div>
                    <span className='text-xs text-slate-500 block'>Status</span>
                    <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100'>
                      {selectedReservation.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              )}
            </section>
          ) : (
            <section className='bg-white rounded-lg border border-slate-border p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[200px]'>
              <span className='material-symbols-outlined text-slate-300 text-4xl mb-2'>info</span>
              <p className='text-sm text-slate-500'>Select a reservation from the list to view details or edit.</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
