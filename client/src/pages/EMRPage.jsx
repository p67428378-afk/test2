import React, { useState } from "react";
import EMRLogger from "../components/emr/EMRLogger";
import EMRTimeline from "../components/emr/EMRTimeline";

export default function EMRPage({ selectedPatient }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEMRCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Electronic Medical Records (EMR)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Log clinical notes, diagnoses, prescriptions, and view patient medical
          history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EMRLogger onEMRRecordCreated={handleEMRCreated} />
        </div>
        <div className="lg:col-span-1">
          <EMRTimeline
            selectedPatientId={selectedPatient?.id}
            refreshTrigger={refreshKey}
          />
        </div>
      </div>
    </div>
  );
}
