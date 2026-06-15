import React from 'react';

export default function RoomResultsTable({ rooms, onSelectRoom, selectedRoomId }) {
  return (
    <section className='bg-white rounded-lg border border-slate-border overflow-hidden shadow-sm'>
      <div className='p-6 border-b border-slate-border bg-slate-50'>
        <h3 className='text-lg font-semibold text-on-surface'>Available Rooms</h3>
        <p className='text-sm text-slate-500 mt-1'>Select a room to proceed with booking</p>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-slate-50 border-b border-slate-border text-xs font-semibold text-slate-500 uppercase tracking-wider'>
              <th className='px-6 py-4'>Room Number</th>
              <th className='px-6 py-4'>Room Type</th>
              <th className='px-6 py-4'>Price per Night</th>
              <th className='px-6 py-4'>Status</th>
              <th className='px-6 py-4 text-right'>Action</th>
            </tr>
          </thead>
          <tbody className='text-sm text-on-surface'>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-6 py-8 text-center text-slate-500'>
                  No available rooms found. Please adjust your search criteria.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr
                  key={room.id}
                  className={`border-b border-slate-border hover:bg-slate-50 transition-colors ${
                    selectedRoomId === room.id ? 'bg-teal-50/50' : ''
                  }`}
                >
                  <td className='px-6 py-4 font-medium'>Room {room.room_number}</td>
                  <td className='px-6 py-4'>{room.room_type}</td>
                  <td className='px-6 py-4 font-medium text-teal-dark'>
                    ${parseFloat(room.price_per_night).toFixed(2)}
                  </td>
                  <td className='px-6 py-4'>
                    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100'>
                      <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                      Available
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <button
                      onClick={() => onSelectRoom(room)}
                      className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                        selectedRoomId === room.id
                          ? 'bg-teal-dark text-white'
                          : 'border border-teal-dark text-teal-dark hover:bg-teal-50'
                      }`}
                    >
                      {selectedRoomId === room.id ? 'Selected' : 'Book Now'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
