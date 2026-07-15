import React, { useState, useEffect } from "react";
import AppointmentsTable from "../components/admin/AppointmentsTable";
import { appointmentService } from "../services/api";

export default function AdminPage() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPending = async () => {
    try {
      const data = await appointmentService.getPending();
      setAppointments(data);
    } catch (err) {
      setError("Failed to fetch pending appointments.");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await appointmentService.approveOrDeny(id, "approved");
      setSuccess("Appointment approved successfully!");
      fetchPending();
    } catch (err) {
      setError("Failed to approve appointment.");
    }
  };

  const handleDeny = async (id, reason) => {
    try {
      await appointmentService.approveOrDeny(id, "denied", reason);
      setSuccess("Appointment denied successfully.");
      fetchPending();
    } catch (err) {
      setError("Failed to deny appointment.");
    }
  };

  return (
    <div className="max-w-container-max w-full mx-auto p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center bg-surface-container p-6 rounded-xl border border-surface-variant shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">
            Prison Staff Portal
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage visitor appointments and scheduling approvals.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg text-sm font-semibold">
          <span>Role: Staff / Admin</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-error-container border border-error text-on-error-container rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-[#132d20] border border-[#1f4a35] text-[#4ade80] rounded-lg text-sm">
          {success}
        </div>
      )}

      <AppointmentsTable
        appointments={appointments}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </div>
  );
}
