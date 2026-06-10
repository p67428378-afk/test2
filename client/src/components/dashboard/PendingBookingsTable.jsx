import React from 'react';

function PendingBookingsTable({ bookings = [], onAccept, onDecline }) {
  return (
    <section className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Pending Bookings</h2>
        <button className="text-primary font-label-md text-label-md hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#334155] text-on-surface-variant font-label-md text-label-md">
              <th className="py-3 px-4 font-normal">Client</th>
              <th className="py-3 px-4 font-normal">Trek</th>
              <th className="py-3 px-4 font-normal">Dates</th>
              <th className="py-3 px-4 font-normal">Status</th>
              <th className="py-3 px-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-[#334155]/50 hover:bg-surface-variant/30 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container font-label-md">
                      {booking.client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-body-md text-body-md text-on-surface">{booking.client.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-on-surface">{booking.trek.name}</span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {booking.duration || '10 days'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 font-body-md text-body-md text-on-surface-variant">
                  {booking.start_date} - {booking.end_date}
                </td>
                <td className="py-4 px-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-caption text-caption inline-flex items-center gap-1 border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {booking.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right space-x-2">
                  <button
                    onClick={() => onAccept && onAccept(booking.id)}
                    className="bg-transparent border border-primary-container text-primary-container px-3 py-1.5 rounded-lg font-label-md text-label-md hover:bg-primary-container/10 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onDecline && onDecline(booking.id)}
                    className="bg-transparent text-slate-400 px-3 py-1.5 rounded-lg font-label-md text-label-md hover:text-slate-100 transition-colors"
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                  No pending bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default PendingBookingsTable;
