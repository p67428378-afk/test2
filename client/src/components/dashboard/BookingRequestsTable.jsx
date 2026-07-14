import React from "react";

export default function BookingRequestsTable({
  bookings,
  onSelectBooking,
  onStatusUpdate,
}) {
  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Upcoming Booking Requests
        </h3>
        <span className="text-outline text-sm">{bookings.length} total</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high/50">
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">
                Trek Route
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-4 font-label-md text-label-md text-outline uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-on-surface-variant"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-surface-container-high/50 transition-colors cursor-pointer"
                  onClick={() => onSelectBooking(booking.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-[10px] text-on-surface font-bold">
                        {booking.client_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-body-md text-body-md text-on-surface">
                        {booking.client_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">
                    {booking.trek_name}
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">
                    {booking.start_date}
                  </td>
                  <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">
                    {booking.end_date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-primary/10 text-primary"
                          : booking.status === "cancelled"
                            ? "bg-error/10 text-error"
                            : "bg-tertiary/10 text-tertiary"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.payment_status === "paid"
                          ? "bg-primary/10 text-primary"
                          : "bg-tertiary/10 text-tertiary"
                      }`}
                    >
                      {booking.payment_status.charAt(0).toUpperCase() +
                        booking.payment_status.slice(1)}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-right space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {booking.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            onStatusUpdate(booking.id, "confirmed")
                          }
                          className="px-3 py-1 bg-primary text-on-primary-container text-label-sm font-label-sm rounded hover:brightness-110 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            onStatusUpdate(booking.id, "cancelled")
                          }
                          className="px-3 py-1 border border-error text-error text-label-sm font-label-sm rounded hover:bg-error/10 transition-all"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-outline italic">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
