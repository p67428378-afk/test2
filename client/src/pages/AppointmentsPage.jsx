import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Field from "../components/common/Field";
import Badge from "../components/common/Badge";
import {
  appointmentService,
  patientService,
  scheduleService,
} from "../services/api";

export default function AppointmentsPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Booking Form State
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("doc-101"); // Default seeded doctor or selected ID
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [aptsRes, ptsRes] = await Promise.allSettled([
        appointmentService.getAppointments(),
        patientService.getPatients(0, 100),
      ]);

      const apts = aptsRes.status === "fulfilled" ? aptsRes.value : [];
      const pts = ptsRes.status === "fulfilled" ? ptsRes.value : [];

      setAppointments(Array.isArray(apts) ? apts : []);
      setPatients(Array.isArray(pts) ? pts : []);

      if (pts.length > 0) {
        setPatientId(pts[0].id);
      }
    } catch (err) {
      console.error("Fetch appointments error:", err);
      setError("Failed to load appointment schedule.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!patientId) {
      setError("Please select a patient.");
      return;
    }

    setSubmitting(true);

    try {
      // Combine date and time into ISO string
      const fullDateTime = new Date(
        `${appointmentDate}T${appointmentTime}:00`,
      ).toISOString();

      const newApt = await appointmentService.createAppointment({
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_time: fullDateTime,
        notes: notes || "General Consultation",
      });

      setSuccessMsg(
        `Appointment booked successfully! Status: ${newApt.status}`,
      );
      setShowModal(false);
      setNotes("");
      fetchData();
    } catch (err) {
      console.error("Book appointment error:", err);
      const detail =
        err.response?.data?.detail ||
        "Double-booking prevention: Slot unavailable or conflicting appointment.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(aptId, newStatus);
      setSuccessMsg(`Appointment status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Status update error:", err);
      setError("Failed to update status.");
    }
  };

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  const columns = [
    {
      header: "Appointment ID",
      accessor: "id",
      render: (row) => (
        <span className="font-mono text-xs text-[#1485b8] font-bold">
          {row.id ? row.id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "Patient UUID",
      accessor: "patient_id",
      render: (row) => (
        <span className="font-mono text-xs text-[#171f2e]">
          {row.patient_id ? row.patient_id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "Date & Time",
      accessor: "appointment_time",
      render: (row) => (
        <span className="text-xs font-semibold">
          {new Date(row.appointment_time).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Notes / Purpose",
      accessor: "notes",
      render: (row) => (
        <span className="text-xs text-[#6b7a8f]">
          {row.notes || "Routine Checkup"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: "Quick Action",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center space-x-1">
          {row.status === "SCHEDULED" && (
            <button
              onClick={() => handleStatusChange(row.id, "CONFIRMED")}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium"
            >
              Confirm
            </button>
          )}
          {row.status === "CONFIRMED" && (
            <button
              onClick={() => handleStatusChange(row.id, "COMPLETED")}
              className="text-xs px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded font-medium"
            >
              Complete
            </button>
          )}
          {row.status !== "CANCELLED" && row.status !== "COMPLETED" && (
            <button
              onClick={() => handleStatusChange(row.id, "CANCELLED")}
              className="text-xs px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171f2e]">
            Doctor Scheduling & Appointment Booking
          </h1>
          <p className="text-xs text-[#6b7a8f]">
            30-minute consultation slot booking with real-time double-booking
            prevention.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setError(null);
            // Default tomorrow date YYYY-MM-DD
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setAppointmentDate(tomorrow.toISOString().split("T")[0]);
            setShowModal(true);
          }}
          icon={Plus}
        >
          Book Consultation Slot
        </Button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-[#db2727] text-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-[#149e52] text-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Appointments List */}
      <DataTable
        columns={columns}
        data={appointments}
        loading={loading}
        searchPlaceholder="Search appointments..."
        emptyMessage="No appointments scheduled."
      />

      {/* Booking Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
              <h2 className="text-base font-bold text-[#171f2e] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1485b8]" />
                <span>Book 30-Min Consultation Slot</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6b7a8f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <Field
                label="Select Patient"
                id="patient_id"
                type="select"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                options={patients.map((p) => ({
                  label: `${p.first_name} ${p.last_name} (${p.ssn_gov_id})`,
                  value: p.id,
                }))}
                placeholder={
                  patients.length === 0
                    ? "No patients registered yet"
                    : "Choose patient"
                }
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Appointment Date"
                  id="appointment_date"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />

                <Field
                  label="Available 30-Min Slot"
                  id="appointment_time"
                  type="select"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  options={timeSlots.map((slot) => ({
                    label: `${slot} Consultation`,
                    value: slot,
                  }))}
                  required
                />
              </div>

              <Field
                label="Consultation Reason / Notes"
                id="notes"
                type="textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Follow-up consultation or Routine checkup"
              />

              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded-lg text-xs flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#1485b8] shrink-0" />
                <span>
                  Concurrency Lock Enabled: Slot is locked upon confirmation to
                  prevent double booking.
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#e0e8f0]">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting
                    ? "Locking Slot..."
                    : "Confirm Consultation Booking"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
