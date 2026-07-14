import React, { useState, useEffect, useRef } from "react";
import {
  getDoctors,
  getDoctorAvailability,
  createAppointment,
  getPatientAppointments,
  cancelAppointment,
  verifyInsurance,
} from "../services/api";
import WeeklyCalendar from "../components/appointments/WeeklyCalendar";
import InsuranceForm from "../components/appointments/InsuranceForm";
import BookingReview from "../components/appointments/BookingReview";

export default function AppointmentBookingDashboard() {
  // State
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date("2026-07-15T00:00:00"),
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); // { iso, label }
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState("patient"); // 'patient' or 'coordinator'
  const [patientId, setPatientId] = useState(
    "00000000-0000-0000-0000-000000000001",
  ); // Default seed patient
  const [customPatientId, setCustomPatientId] = useState("");
  const [wsConnected, setWsConnected] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Insurance Pre-Verification State
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const wsRef = useRef(null);

  // Fetch initial doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctorId(data[0].id);
          setSelectedSpecialty(data[0].specialty);
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
        setErrorMessage("Failed to load doctors list.");
      }
    };
    fetchDoctors();
  }, []);

  // Fetch doctor availability when doctor or date changes
  useEffect(() => {
    if (!selectedDoctorId) return;

    const fetchAvailability = async () => {
      try {
        // Calculate start and end of the week for the calendar
        const startOfWeek = new Date("2026-07-13T00:00:00");
        const endOfWeek = new Date("2026-07-19T23:59:59");
        const startStr = startOfWeek.toISOString().split("T")[0];
        const endStr = endOfWeek.toISOString().split("T")[0];

        const data = await getDoctorAvailability(
          selectedDoctorId,
          startStr,
          endStr,
        );
        setAvailableSlots(data.slots || []);
      } catch (err) {
        console.error("Failed to fetch availability", err);
      }
    };

    fetchAvailability();

    // Set up polling fallback
    const interval = setInterval(fetchAvailability, 5000);

    return () => clearInterval(interval);
  }, [selectedDoctorId, selectedDate]);

  // Fetch patient appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const activePatientId =
          role === "coordinator" && customPatientId
            ? customPatientId
            : patientId;
        const data = await getPatientAppointments(activePatientId);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, [patientId, customPatientId, role]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/availability`;
    const connectWs = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.doctorId === selectedDoctorId && data.slots) {
              setAvailableSlots(data.slots);
            }
          } catch (e) {
            console.error("Failed to parse WS message", e);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          // Reconnect after 5 seconds
          setTimeout(connectWs, 5000);
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (e) {
        console.error("WS connection error", e);
      }
    };

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [selectedDoctorId]);

  // Handlers
  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    setSelectedDoctorId(docId);
    const doc = doctors.find((d) => d.id === docId);
    if (doc) {
      setSelectedSpecialty(doc.specialty);
    }
    setSelectedSlot(null);
  };

  const handleSpecialtyChange = (e) => {
    const spec = e.target.value;
    setSelectedSpecialty(spec);
    const filtered = doctors.filter((d) => d.specialty === spec);
    if (filtered.length > 0) {
      setSelectedDoctorId(filtered[0].id);
    } else {
      setSelectedDoctorId("");
    }
    setSelectedSlot(null);
  };

  const handleSelectSlot = (iso, label) => {
    setSelectedSlot({ iso, label });
  };

  const handleVerifyInsurance = async (provider, policy) => {
    try {
      setVerificationError("");
      setVerificationResult(null);
      setIsVerifying(true);

      const activePatientId =
        role === "coordinator" && customPatientId ? customPatientId : patientId;

      const result = await verifyInsurance({
        patient_id: activePatientId,
        insurance_provider: provider,
        policy_id: policy,
      });

      setInsuranceProvider(provider);
      setPolicyId(policy);
      setVerificationResult(result);
    } catch (err) {
      console.error("Insurance verification failed", err);
      setVerificationError(
        err.response?.data?.detail ||
          "Insurance verification failed. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;
    try {
      setErrorMessage("");
      setSuccessMessage("");
      setIsBooking(true);
      const activePatientId =
        role === "coordinator" && customPatientId ? customPatientId : patientId;

      const payload = {
        doctorId: selectedDoctorId,
        patientId: activePatientId,
        startTime: selectedSlot.iso,
        insurance_provider: insuranceProvider || null,
        policy_id: policyId || null,
      };

      await createAppointment(payload);
      setSuccessMessage("Appointment booked successfully!");
      setSelectedSlot(null);
      setVerificationResult(null);
      setInsuranceProvider("");
      setPolicyId("");

      // Refresh appointments
      const updated = await getPatientAppointments(activePatientId);
      setAppointments(updated);
    } catch (err) {
      console.error("Booking failed", err);
      setErrorMessage(
        err.response?.data?.detail ||
          "Failed to book appointment. Slot might be double-booked.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await cancelAppointment(appointmentId);
      setSuccessMessage("Appointment cancelled successfully.");

      // Refresh appointments
      const activePatientId =
        role === "coordinator" && customPatientId ? customPatientId : patientId;
      const updated = await getPatientAppointments(activePatientId);
      setAppointments(updated);
    } catch (err) {
      console.error("Cancellation failed", err);
      setErrorMessage("Failed to cancel appointment.");
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);
  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  return (
    <div class="max-w-7xl mx-auto space-y-unit-lg">
      {/* Role Switcher & Patient ID Config */}
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-unit-lg flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="font-bold text-on-surface">Current Role:</span>
          <div class="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setRole("patient")}
              class={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                role === "patient"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole("coordinator")}
              class={`px-4 py-2 text-sm font-medium rounded-r-lg border-t border-r border-b ${
                role === "coordinator"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Front-Desk Coordinator
            </button>
          </div>
        </div>

        {role === "coordinator" && (
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">
              Patient UUID:
            </label>
            <input
              type="text"
              placeholder="Enter Patient UUID"
              value={customPatientId}
              onChange={(e) => setCustomPatientId(e.target.value)}
              class="border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        )}

        <div class="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
          Test Account:{" "}
          <span class="font-mono font-bold">
            test@example.com / testpassword
          </span>
        </div>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined text-emerald-600">
            check_circle
          </span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <span class="material-symbols-outlined text-red-600">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Row 1: Filter & Search Panel */}
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-unit-lg grid grid-cols-1 md:grid-cols-3 gap-unit-md">
        <div>
          <label class="block text-label-sm font-label-sm text-on-surface-variant mb-1">
            Specialty
          </label>
          <div class="relative">
            <select
              value={selectedSpecialty}
              onChange={handleSpecialtyChange}
              class="block w-full pl-3 pr-10 py-2 text-body-md font-body-md border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none bg-white"
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
              <span class="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-label-sm font-label-sm text-on-surface-variant mb-1">
            Doctor
          </label>
          <div class="relative">
            <select
              value={selectedDoctorId}
              onChange={handleDoctorChange}
              class="block w-full pl-3 pr-10 py-2 text-body-md font-body-md border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none bg-white"
            >
              <option value="">Select Doctor</option>
              {doctors
                .filter(
                  (d) =>
                    !selectedSpecialty || d.specialty === selectedSpecialty,
                )
                .map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
              <span class="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-label-sm font-label-sm text-on-surface-variant mb-1">
            Date
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="material-symbols-outlined text-outline">
                calendar_today
              </span>
            </div>
            <input
              class="block w-full pl-10 pr-3 py-2 text-body-md font-body-md border border-outline-variant rounded-lg bg-surface-variant/30 focus:outline-none cursor-default"
              readonly
              type="text"
              value="July 15, 2026"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Main Booking Interface */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-unit-lg">
        {/* Left (8/12): Weekly Calendar View */}
        <div class="lg:col-span-8">
          <WeeklyCalendar
            selectedDate={selectedDate}
            onSelectSlot={handleSelectSlot}
            availableSlots={availableSlots}
            wsConnected={wsConnected}
          />
        </div>

        {/* Right (4/12): Split Pane Layout for Insurance & Review */}
        <div class="lg:col-span-4 space-y-6">
          <InsuranceForm
            onVerify={handleVerifyInsurance}
            isVerifying={isVerifying}
            verificationResult={verificationResult}
            error={verificationError}
          />
          <BookingReview
            selectedSlot={selectedSlot}
            selectedDoctor={selectedDoctor}
            verificationResult={verificationResult}
            onConfirm={handleConfirmBooking}
            isBooking={isBooking}
          />
        </div>
      </div>

      {/* Row 3: Upcoming Appointments Table */}
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div class="p-unit-md border-b border-outline-variant flex justify-between items-center bg-surface-variant/10">
          <h2 class="font-headline-sm text-headline-sm text-on-surface">
            Upcoming Appointments
          </h2>
          <button class="text-primary hover:text-primary-container font-label-md text-label-md transition-colors">
            View All
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant">
                <th class="p-4 font-label-md text-label-md text-on-surface-variant">
                  Doctor
                </th>
                <th class="p-4 font-label-md text-label-md text-on-surface-variant">
                  Specialty
                </th>
                <th class="p-4 font-label-md text-label-md text-on-surface-variant">
                  Date & Time
                </th>
                <th class="p-4 font-label-md text-label-md text-on-surface-variant">
                  Status
                </th>
                <th class="p-4 font-label-md text-label-md text-on-surface-variant text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colspan="5"
                    class="p-8 text-center text-on-surface-variant"
                  >
                    No upcoming appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    class="hover:bg-[#F1F5F9] transition-colors"
                  >
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-label-sm">
                          {appt.doctorName
                            ? appt.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "DR"}
                        </div>
                        <span class="font-body-md text-body-md text-on-surface font-medium">
                          {appt.doctorName}
                        </span>
                      </div>
                    </td>
                    <td class="p-4 font-body-sm text-body-sm text-on-surface-variant">
                      {doctors.find((d) => d.name === appt.doctorName)
                        ?.specialty || "General Medicine"}
                    </td>
                    <td class="p-4 font-body-sm text-body-sm text-on-surface-variant">
                      {new Date(appt.start_time).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <br />
                      <span class="text-xs">
                        {new Date(appt.start_time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td class="p-4">
                      <span
                        class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          appt.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        class="text-error hover:text-error-container font-label-sm text-label-sm bg-error/10 hover:bg-error/20 px-3 py-1.5 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
