import React, { useState } from "react";
import ConsultationForm from "../components/medical-records/ConsultationForm";
import PatientSummary from "../components/medical-records/PatientSummary";

export default function MedicalRecordsPage({
  patients,
  doctors,
  medications,
  onCreateRecord,
  onCreatePrescription,
}) {
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="space-y-section-gap">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
          Medical Records
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Securely store and manage patient medical records, diagnoses, and
          prescriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gutter">
        <div className="lg:col-span-2 space-y-6">
          <ConsultationForm
            patients={patients}
            doctors={doctors}
            medications={medications}
            onCreateRecord={onCreateRecord}
            onCreatePrescription={onCreatePrescription}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4 font-bold">
              Select Patient History
            </h3>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
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

          <PatientSummary patient={selectedPatient} />
        </div>
      </div>
    </div>
  );
}
