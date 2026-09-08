import React from "react";
import {
  Calendar,
  User,
  Phone,
  Mail,
  ArrowRight,
  XCircle,
  LogIn,
  LogOut,
  Receipt,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function ReservationTable({
  reservations = [],
  onCheckIn,
  onCheckOut,
  onCancel,
  onViewInvoice,
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500">Loading reservations...</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          No Reservations Found
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Try adjusting your search criteria or create a new booking.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                Guest Details
              </th>
              <th scope="col" className="px-6 py-4">
                Room Type
              </th>
              <th scope="col" className="px-6 py-4">
                Stay Dates
              </th>
              <th scope="col" className="px-6 py-4">
                Assigned Room
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservations.map((res) => {
              const guestName = res.guest?.full_name || "Guest";
              const guestEmail = res.guest?.email || "N/A";
              const guestPhone = res.guest?.phone || "N/A";
              const roomNumber =
                res.room?.room_number ||
                (res.room_id ? "Assigned" : "Unassigned");

              return (
                <tr key={res.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      {guestName}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {guestEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {guestPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {res.room_type}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
                      <span>{res.start_date}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span>{res.end_date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                      {roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={res.status} type="reservation" />
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    {res.status === "CONFIRMED" && (
                      <button
                        onClick={() => onCheckIn && onCheckIn(res)}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition"
                      >
                        <LogIn className="w-3.5 h-3.5" /> Check-In
                      </button>
                    )}
                    {res.status === "CHECKED_IN" && (
                      <button
                        onClick={() => onCheckOut && onCheckOut(res)}
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Check-Out
                      </button>
                    )}
                    <button
                      onClick={() => onViewInvoice && onViewInvoice(res)}
                      className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
                      title="View Billing Statement"
                    >
                      <Receipt className="w-3.5 h-3.5 text-slate-500" /> Folio
                    </button>
                    {res.status === "CONFIRMED" && (
                      <button
                        onClick={() => onCancel && onCancel(res.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 text-xs font-medium px-2 py-1.5 rounded-lg transition"
                        title="Cancel Reservation"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
