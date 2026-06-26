import React from "react";

export default function PatientSummary({ patient }) {
  if (!patient) {
    return (
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 text-center text-on-surface-variant shadow-sm">
        Select a patient to view their medical summary and history.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 shadow-sm space-y-4">
      <div className="border-b border-outline-variant pb-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
          {patient.name}
        </h3>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          Patient ID: {patient.id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-on-surface-variant font-medium">Date of Birth</p>
          <p className="text-on-surface font-semibold">
            {patient.date_of_birth}
          </p>
        </div>
        <div>
          <p className="text-on-surface-variant font-medium">Gender</p>
          <p className="text-on-surface font-semibold">{patient.gender}</p>
        </div>
        <div>
          <p className="text-on-surface-variant font-medium">Phone</p>
          <p className="text-on-surface font-semibold">
            {patient.phone || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-on-surface-variant font-medium">Email</p>
          <p className="text-on-surface font-semibold">
            {patient.email || "N/A"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-on-surface-variant font-medium">Address</p>
          <p className="text-on-surface font-semibold">
            {patient.address || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-on-surface-variant font-medium">
            Insurance Provider
          </p>
          <p className="text-on-surface font-semibold">
            {patient.insurance_provider || "None"}
          </p>
        </div>
        <div>
          <p className="text-on-surface-variant font-medium">Policy Number</p>
          <p className="text-on-surface font-semibold">
            {patient.insurance_policy_number || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
