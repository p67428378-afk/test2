import React, { useState } from "react";
import DoctorSlotGrid from "../components/appointments/DoctorSlotGrid";
import AppointmentTracker from "../components/appointments/AppointmentTracker";

export default function AppointmentsPage({ selectedPatient }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Doctor Scheduling & Appointments
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage doctor availability slots and track appointment workflows
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <DoctorSlotGrid onSelectSlot={handleSelectSlot} />
        </div>
        <div className="lg:col-span-2">
          <AppointmentTracker
            selectedSlot={selectedSlot}
            selectedPatient={selectedPatient}
          />
        </div>
      </div>
    </div>
  );
}
