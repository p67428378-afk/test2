import React, { useState } from "react";
import PatientRegistrationForm from "../components/patients/PatientRegistrationForm";
import PatientDirectoryTable from "../components/patients/PatientDirectoryTable";

export default function PatientsPage({ onSelectPatient }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePatientCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Patient Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Register new patient profiles and look up existing records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientRegistrationForm onPatientCreated={handlePatientCreated} />
        <PatientDirectoryTable
          refreshTrigger={refreshKey}
          onSelectPatient={onSelectPatient}
        />
      </div>
    </div>
  );
}
