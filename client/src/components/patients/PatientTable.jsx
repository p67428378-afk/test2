import React from "react";

export default function PatientTable({ patients, onSelectPatient }) {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Registered Patients
        </h3>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          Select a patient to view details or manage records
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Name
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Date of Birth
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Gender
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Phone
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Email
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Insurance
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
            {patients.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-on-surface-variant"
                >
                  No patients found. Register a new patient to get started.
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-surface-container-low transition-colors h-[56px] group cursor-pointer"
                  onClick={() => onSelectPatient && onSelectPatient(patient)}
                >
                  <td className="py-3 px-4 font-medium text-primary hover:underline">
                    {patient.name}
                  </td>
                  <td className="py-3 px-4">{patient.date_of_birth}</td>
                  <td className="py-3 px-4">{patient.gender}</td>
                  <td className="py-3 px-4">{patient.phone || "N/A"}</td>
                  <td className="py-3 px-4">{patient.email || "N/A"}</td>
                  <td className="py-3 px-4">
                    {patient.insurance_provider ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        {patient.insurance_provider}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant text-xs">
                        None
                      </span>
                    )}
                  </td>
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        onSelectPatient && onSelectPatient(patient)
                      }
                      className="text-primary hover:text-primary-container font-semibold text-sm"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
