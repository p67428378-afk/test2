import React, { useState } from "react";
import RegistrationForm from "../components/patients/RegistrationForm";
import PatientTable from "../components/patients/PatientTable";
import PatientSummary from "../components/medical-records/PatientSummary";

export default function PatientsPage({ patients, onRegisterPatient }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-section-gap">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
          Patient Management
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Register new patients and manage existing patient records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gutter">
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Search patients by name..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <PatientTable
            patients={filteredPatients}
            onSelectPatient={setSelectedPatient}
          />
        </div>

        <div className="space-y-6">
          <RegistrationForm onRegisterSuccess={onRegisterPatient} />
          <PatientSummary patient={selectedPatient} />
        </div>
      </div>
    </div>
  );
}
