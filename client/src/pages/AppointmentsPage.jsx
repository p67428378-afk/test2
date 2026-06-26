import React from "react";
import BookingForm from "../components/appointments/BookingForm";
import AppointmentTable from "../components/appointments/AppointmentTable";

export default function AppointmentsPage({
  patients,
  doctors,
  appointments,
  onBookAppointment,
  onCancelAppointment,
}) {
  return (
    <div className="space-y-section-gap">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
          Doctor Appointments
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Schedule, view, and cancel doctor appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gutter">
        <div className="lg:col-span-2">
          <AppointmentTable
            appointments={appointments}
            onCancelAppointment={onCancelAppointment}
          />
        </div>

        <div>
          <BookingForm
            patients={patients}
            doctors={doctors}
            onBookSuccess={onBookAppointment}
          />
        </div>
      </div>
    </div>
  );
}
