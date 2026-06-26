import React from "react";

export default function AppointmentTable({
  appointments,
  onCancelAppointment,
}) {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "cancelled":
        return "bg-error-container text-error border border-error/20";
      default:
        return "bg-secondary-fixed text-primary-fixed border border-secondary-fixed-dim";
    }
  };

  const formatDateTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Scheduled Appointments
        </h3>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          Manage upcoming and past appointments
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Date & Time
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Patient Name
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Doctor
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Notes
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Status
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-on-surface-variant"
                >
                  No appointments scheduled. Book a new appointment to get
                  started.
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="hover:bg-surface-container-low transition-colors h-[56px] group"
                >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">
                    {formatDateTime(appt.appointment_date)}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {appt.patient_name}
                  </td>
                  <td className="py-3 px-4">{appt.doctor_name}</td>
                  <td
                    className="py-3 px-4 max-w-xs truncate"
                    title={appt.notes}
                  >
                    {appt.notes || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(appt.status)}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {appt.status?.toLowerCase() === "scheduled" && (
                      <button
                        onClick={() =>
                          onCancelAppointment && onCancelAppointment(appt.id)
                        }
                        className="text-error hover:text-on-error-container font-semibold text-sm transition-colors"
                      >
                        Cancel
                      </button>
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
