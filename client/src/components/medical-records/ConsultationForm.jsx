import React, { useState } from "react";

export default function ConsultationForm({
  patients,
  doctors,
  medications,
  onCreateRecord,
  onCreatePrescription,
}) {
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    visit_date: new Date().toISOString().split("T")[0],
    symptoms: "",
    diagnosis: "",
    treatment_plan: "",
  });

  const [prescriptionData, setPrescriptionData] = useState({
    medication_id: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const [addPrescription, setAddPrescription] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (
      !formData.patient_id ||
      !formData.doctor_id ||
      !formData.symptoms ||
      !formData.diagnosis
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create medical record
      const record = await onCreateRecord(formData);
      let prescriptionMsg = "";

      // 2. Create prescription if selected
      if (addPrescription && prescriptionData.medication_id) {
        await onCreatePrescription({
          ...prescriptionData,
          medical_record_id: record.id,
        });
        prescriptionMsg = " and prescription created";
      }

      setSuccess(`Medical record${prescriptionMsg} created successfully!`);
      setFormData({
        patient_id: "",
        doctor_id: "",
        visit_date: new Date().toISOString().split("T")[0],
        symptoms: "",
        diagnosis: "",
        treatment_plan: "",
      });
      setPrescriptionData({
        medication_id: "",
        dosage: "",
        frequency: "",
        duration: "",
      });
      setAddPrescription(false);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create medical record. Please check permissions or input.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
        New Consultation / Visit Record
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="patient_id"
            >
              Patient *
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
              htmlFor="doctor_id"
            >
              Consulting Doctor *
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
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-on-surface-variant mb-1"
              htmlFor="visit_date"
            >
              Visit Date *
            </label>
            <input
              type="date"
              id="visit_date"
              name="visit_date"
              required
              value={formData.visit_date}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="symptoms"
          >
            Symptoms *
          </label>
          <textarea
            id="symptoms"
            name="symptoms"
            required
            rows="2"
            value={formData.symptoms}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Describe symptoms..."
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="diagnosis"
          >
            Diagnosis *
          </label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            required
            rows="2"
            value={formData.diagnosis}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Enter diagnosis..."
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="treatment_plan"
          >
            Treatment Plan
          </label>
          <textarea
            id="treatment_plan"
            name="treatment_plan"
            rows="2"
            value={formData.treatment_plan}
            onChange={handleChange}
            className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Enter treatment plan..."
          />
        </div>

        {/* Prescription Section */}
        <div className="border-t border-outline-variant pt-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="addPrescription"
              checked={addPrescription}
              onChange={(e) => setAddPrescription(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary"
            />
            <label
              htmlFor="addPrescription"
              className="text-sm font-semibold text-on-surface cursor-pointer"
            >
              Add Prescription
            </label>
          </div>

          {addPrescription && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-lg border border-outline-variant">
              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="medication_id"
                >
                  Medication *
                </label>
                <select
                  id="medication_id"
                  name="medication_id"
                  required={addPrescription}
                  value={prescriptionData.medication_id}
                  onChange={handlePrescriptionChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">-- Select Medication --</option>
                  {medications.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.name} ({med.code}) - Stock: {med.stock_quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="dosage"
                >
                  Dosage *
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  required={addPrescription}
                  value={prescriptionData.dosage}
                  onChange={handlePrescriptionChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. 500mg"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="frequency"
                >
                  Frequency *
                </label>
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  required={addPrescription}
                  value={prescriptionData.frequency}
                  onChange={handlePrescriptionChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. Twice daily"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="duration"
                >
                  Duration *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  required={addPrescription}
                  value={prescriptionData.duration}
                  onChange={handlePrescriptionChange}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="e.g. 7 days"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Consultation"}
          </button>
        </div>
      </form>
    </div>
  );
}
