import React, { useState } from "react";

export default function AppointmentsTable({ appointments, onApprove, onDeny }) {
  const [denialReason, setDenialReason] = useState("");
  const [selectedApptId, setSelectedApptId] = useState(null);

  const handleDenySubmit = (e) => {
    e.preventDefault();
    if (!denialReason) return;
    onDeny(selectedApptId, denialReason);
    setSelectedApptId(null);
    setDenialReason("");
  };

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-surface-variant shadow-lg">
      <header className="mb-6 border-b border-surface-variant pb-4">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Pending Appointments
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Review, approve, or deny visitor appointment requests.
        </p>
      </header>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant">
          No pending appointments found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant text-on-surface-variant font-label-sm text-label-sm">
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Government ID</th>
                <th className="py-3 px-4">Inmate</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="border-b border-surface-variant hover:bg-surface-container-high transition-colors text-body-sm text-on-surface"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold">
                      {appt.visitor.full_name}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {appt.visitor.email}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono">{appt.visitor.gov_id}</td>
                  <td className="py-4 px-4">
                    <div className="font-semibold">{appt.inmate.full_name}</div>
                    <div className="text-xs text-on-surface-variant">
                      #{appt.inmate.inmate_number}
                    </div>
                  </td>
                  <td className="py-4 px-4">{appt.requested_date}</td>
                  <td className="py-4 px-4">{appt.time_slot}</td>
                  <td className="py-4 px-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => onApprove(appt.id)}
                      className="bg-[#132d20] border border-[#1f4a35] text-[#4ade80] hover:bg-opacity-80 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedApptId(appt.id)}
                      className="bg-error-container border border-error text-on-error-container hover:bg-opacity-80 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedApptId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-high border border-surface-variant p-6 rounded-xl max-w-md w-full shadow-2xl">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
              Deny Appointment
            </h3>
            <form onSubmit={handleDenySubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label
                  className="font-label-sm text-label-sm text-on-surface-variant"
                  htmlFor="denialReason"
                >
                  Reason for Denial
                </label>
                <textarea
                  id="denialReason"
                  rows="3"
                  className="bg-surface-container border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-fixed"
                  placeholder="e.g., Scheduling conflict, visitor flagged, etc."
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApptId(null)}
                  className="bg-secondary-container text-on-secondary-container hover:bg-opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-error-container border border-error text-on-error-container hover:bg-opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Confirm Denial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
