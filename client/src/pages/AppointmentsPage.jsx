import React, { useState, useEffect } from "react";
import { appointmentsApi, petsApi } from "../services/api";
import AppointmentRoster from "../components/appointments/AppointmentRoster";
import BookingFormModal from "../components/appointments/BookingFormModal";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [apptData, petsData] = await Promise.all([
        appointmentsApi.getAppointments().catch(() => []),
        petsApi.getPets().catch(() => []),
      ]);
      setAppointments(apptData || []);
      setPets(petsData || []);
    } catch (err) {
      console.error("Failed to load appointments data:", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAppointment = async (payload) => {
    await appointmentsApi.createAppointment(payload);
    fetchData();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentsApi.updateAppointmentStatus(id, { status });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update status");
    }
  };

  const petsMap = pets.reduce((acc, p) => {
    acc[p.id] = p;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Appointment Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Schedule visit consultations and track appointment state machine
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm"
        >
          {error}
        </div>
      )}

      <AppointmentRoster
        appointments={appointments}
        petsMap={petsMap}
        onOpenBookingModal={() => setIsBookingOpen(true)}
        onUpdateStatus={handleUpdateStatus}
      />

      <BookingFormModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={handleCreateAppointment}
        pets={pets}
      />
    </div>
  );
}
