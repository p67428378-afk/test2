import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Stethoscope,
} from "lucide-react";
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "../../services/api";

export default function AppointmentTracker({
  selectedSlot,
  selectedPatient,
  onAppointmentBooked,
}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Booking form state
  const [patientIdInput, setPatientIdInput] = useState("");
  const [doctorIdInput, setDoctorIdInput] = useState("");
  const [slotIdInput, setSlotIdInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    if (selectedPatient?.id) {
      setPatientIdInput(selectedPatient.id);
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedSlot?.id) {
      setSlotIdInput(selectedSlot.id);
      setDoctorIdInput(selectedSlot.doctor_id);
    }
  }, [selectedSlot]);

  const fetchAppointmentsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments({ limit: 50 });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch appointments list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentsList();
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const payload = {
        patient_id: patientIdInput,
        doctor_id: doctorIdInput,
        slot_id: slotIdInput,
        reason_for_visit: reasonInput || null,
      };

      const res = await bookAppointment(payload);
      setBookingSuccess(`Appointment booked successfully! ID: ${res.id}`);
      setReasonInput("");
      fetchAppointmentsList();
      if (onAppointmentBooked) onAppointmentBooked(res);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to book appointment";
      setBookingError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setBookingLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointmentsList();
    } catch (err) {
      alert(
        "Failed to update status: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Booking Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Book Appointment
            </h2>
            <p className="text-xs text-slate-500">
              Lock slot and schedule consultation
            </p>
          </div>
        </div>

        {bookingError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        {bookingSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>{bookingSuccess}</span>
          </div>
        )}

        <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Patient UUID *
            </label>
            <input
              type="text"
              required
              value={patientIdInput}
              onChange={(e) => setPatientIdInput(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {selectedPatient && (
              <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">
                Selected: {selectedPatient.full_name}
              </span>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Doctor UUID *
            </label>
            <input
              type="text"
              required
              value={doctorIdInput}
              onChange={(e) => setDoctorIdInput(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440001"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Slot UUID *
            </label>
            <input
              type="text"
              required
              value={slotIdInput}
              onChange={(e) => setSlotIdInput(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440002"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {selectedSlot && (
              <span className="text-[11px] text-indigo-600 font-medium mt-0.5 block">
                Selected Slot ({selectedSlot.department}):{" "}
                {new Date(selectedSlot.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Reason for Visit
            </label>
            <textarea
              rows="2"
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="Brief description of symptoms or consultation purpose..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {bookingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarCheck className="h-4 w-4" />
              )}
              <span>Confirm Appointment Booking</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appointment Tracker List Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Active Appointments Lifecycle
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Track and transition appointment status
        </p>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No appointments scheduled yet.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-500 font-semibold">
                    ID: {app.id.slice(0, 8)}...
                  </span>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`font-semibold px-2 py-0.5 rounded border text-[11px] bg-white ${
                      app.status === "Scheduled"
                        ? "text-blue-700 border-blue-300"
                        : app.status === "In-Progress"
                          ? "text-amber-700 border-amber-300"
                          : app.status === "Completed"
                            ? "text-emerald-700 border-emerald-300"
                            : "text-rose-700 border-rose-300"
                    }`}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="truncate">Patient: {app.patient_id}</div>
                  <div className="truncate">Doctor: {app.doctor_id}</div>
                </div>

                {app.reason_for_visit && (
                  <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-100">
                    "{app.reason_for_visit}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
