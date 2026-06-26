import React, { useState } from "react";

export default function BookingForm({ patients, doctors, onBookSuccess }) {
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.patient_id ||
      !formData.doctor_id ||
      !formData.appointment_date
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Convert date to ISO 8601 format if needed
      const isoDate = new Date(formData.appointment_date).toISOString();
      await onBookSuccess({
        ...formData,
        appointment_date: isoDate,
      });
      setSuccess("Appointment booked successfully!");
      setFormData({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        notes: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to book appointment. Double-booking or conflict.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        Book New Appointment
      </h3>

      {error && (
        <div
          className="mb-4 p-3 bg-error-container text-error rounded-lg text-sm font-medium"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="patient_id"
          >
            Select Patient *
          </label>
          <select
            id="patient_id"
            name="patient_id"
            required
            value={formData.patient_id}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.date_of_birth})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="doctor_id"
          >
            Select Doctor *
          </label>
          <select
            id="doctor_id"
            name="doctor_id"
            required
            value={formData.doctor_id}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="appointment_date"
          >
            Appointment Date & Time *
          </label>
          <input
            type="datetime-local"
            id="appointment_date"
            name="appointment_date"
            required
            value={formData.appointment_date}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="notes"
          >
            Notes / Symptoms
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Reason for appointment..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}
