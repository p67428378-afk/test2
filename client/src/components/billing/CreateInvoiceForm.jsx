import React, { useState } from "react";

export default function CreateInvoiceForm({
  patients,
  appointments,
  onCreateInvoice,
}) {
  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_id: "",
    amount: 0,
    tax: 0,
    discount: 0,
    billing_code: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "tax" || name === "discount"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.patient_id ||
      !formData.billing_code ||
      formData.amount <= 0
    ) {
      setError(
        "Please fill in all required fields and ensure amount is greater than 0.",
      );
      setLoading(false);
      return;
    }

    try {
      await onCreateInvoice(formData);
      setSuccess("Invoice generated successfully!");
      setFormData({
        patient_id: "",
        appointment_id: "",
        amount: 0,
        tax: 0,
        discount: 0,
        billing_code: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        Generate New Invoice
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="appointment_id"
            >
              Linked Appointment (Optional)
            </label>
            <select
              id="appointment_id"
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">-- Select Appointment --</option>
              {appointments
                .filter((appt) => appt.patient_id === formData.patient_id)
                .map((appt) => (
                  <option key={appt.id} value={appt.id}>
                    {new Date(appt.appointment_date).toLocaleDateString()} -{" "}
                    {appt.doctor_name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="billing_code"
            >
              Billing / Service Code *
            </label>
            <input
              type="text"
              id="billing_code"
              name="billing_code"
              required
              value={formData.billing_code}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. CONSULT-01, LAB-XRAY"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="amount"
            >
              Base Amount ($) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="tax"
            >
              Tax ($)
            </label>
            <input
              type="number"
              id="tax"
              name="tax"
              min="0"
              step="0.01"
              value={formData.tax}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="discount"
            >
              Discount ($)
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="border-t border-outline-variant pt-4 flex justify-between items-center">
          <div className="text-lg font-bold text-on-surface">
            Total Amount: $
            {(formData.amount + formData.tax - formData.discount).toFixed(2)}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
