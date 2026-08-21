import React, { useState, useEffect } from "react";
import {
  FileText,
  Pill,
  Plus,
  ShieldAlert,
  CheckCircle2,
  X,
  Stethoscope,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Field from "../components/common/Field";
import Badge from "../components/common/Badge";
import {
  medicalService,
  patientService,
  appointmentService,
} from "../services/api";

export default function MedicalRecordsPage({ user }) {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Medical Record Form
  const [recordForm, setRecordForm] = useState({
    patient_id: "",
    doctor_id: user?.id || "doc-101",
    appointment_id: "",
    diagnosis: "",
    notes: "",
    lab_tests: [],
  });

  // Prescription Form
  const [prescriptionForm, setPrescriptionForm] = useState({
    medication_name: "Amoxicillin",
    dosage: "500mg - 3x daily",
    instructions: "Take after meals for 7 days.",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recordsRes, patientsRes, aptsRes] = await Promise.allSettled([
        medicalService.getMedicalRecords(),
        patientService.getPatients(0, 100),
        appointmentService.getAppointments(0, 100),
      ]);

      const records = recordsRes.status === "fulfilled" ? recordsRes.value : [];
      const pts = patientsRes.status === "fulfilled" ? patientsRes.value : [];
      const apts = aptsRes.status === "fulfilled" ? aptsRes.value : [];

      setMedicalRecords(Array.isArray(records) ? records : []);
      setPatients(Array.isArray(pts) ? pts : []);
      setAppointments(Array.isArray(apts) ? apts : []);

      if (pts.length > 0) {
        setRecordForm((prev) => ({
          ...prev,
          patient_id: pts[0].id,
          appointment_id: apts.length > 0 ? apts[0].id : "",
        }));
      }
    } catch (err) {
      console.error("Fetch medical records error:", err);
      setError("Failed to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!recordForm.patient_id) {
      setError("Please select a patient.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        patient_id: recordForm.patient_id,
        doctor_id: user?.id || recordForm.doctor_id,
        appointment_id:
          recordForm.appointment_id || appointments[0]?.id || "apt-101",
        diagnosis: recordForm.diagnosis,
        notes: recordForm.notes,
      };

      const newRecord = await medicalService.createMedicalRecord(payload);
      setSuccessMsg(
        `Clinical record created! Record ID: ${newRecord.id.slice(0, 8)}`,
      );
      setShowRecordModal(false);
      // Reset form
      setRecordForm({
        patient_id: patients[0]?.id || "",
        doctor_id: user?.id || "doc-101",
        appointment_id: appointments[0]?.id || "",
        diagnosis: "",
        notes: "",
        lab_tests: [],
      });
      fetchData();
    } catch (err) {
      console.error("Create medical record error:", err);
      const detail =
        err.response?.data?.detail || "Failed to log consultation record.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedRecordId) {
      setError("No medical record selected.");
      return;
    }

    setSubmitting(true);

    try {
      await medicalService.createPrescription({
        medical_record_id: selectedRecordId,
        medication_name: prescriptionForm.medication_name,
        dosage: prescriptionForm.dosage,
        instructions: prescriptionForm.instructions,
      });

      setSuccessMsg(
        `Digital prescription added to record ${selectedRecordId.slice(0, 8)}!`,
      );
      setShowPrescriptionModal(false);
      fetchData();
    } catch (err) {
      console.error("Create prescription error:", err);
      const detail =
        err.response?.data?.detail || "Failed to create digital prescription.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Record ID",
      accessor: "id",
      render: (row) => (
        <span className="font-mono text-xs text-[#1485b8] font-bold">
          {row.id ? row.id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "Patient UUID",
      accessor: "patient_id",
      render: (row) => (
        <span className="font-mono text-xs text-[#171f2e]">
          {row.patient_id ? row.patient_id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "Diagnosis",
      accessor: "diagnosis",
      render: (row) => (
        <span className="font-semibold text-[#171f2e]">{row.diagnosis}</span>
      ),
    },
    {
      header: "Consultation Notes",
      accessor: "notes",
      render: (row) => (
        <span className="text-xs text-[#6b7a8f]">
          {row.notes || "No notes."}
        </span>
      ),
    },
    {
      header: "Prescriptions",
      accessor: "prescriptions",
      render: (row) => (
        <div className="space-y-1">
          {row.prescriptions && row.prescriptions.length > 0 ? (
            row.prescriptions.map((p, idx) => (
              <div
                key={idx}
                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono"
              >
                💊 {p.medication_name} ({p.dosage})
              </div>
            ))
          ) : (
            <span className="text-xs text-[#6b7a8f] italic">None issued</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRecordId(row.id);
            setShowPrescriptionModal(true);
          }}
          icon={Pill}
        >
          Add Prescription
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171f2e]">
            Medical Records & Digital Prescriptions
          </h1>
          <p className="text-xs text-[#6b7a8f]">
            Clinical consultation logging, lab orders, and digital physician
            prescriptions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setError(null);
            setShowRecordModal(true);
          }}
          icon={Stethoscope}
        >
          Log Consultation Notes
        </Button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-[#db2727] text-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-[#149e52] text-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={medicalRecords}
        loading={loading}
        searchPlaceholder="Search medical records by diagnosis..."
        emptyMessage="No medical records logged."
      />

      {/* Log Consultation Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
              <h2 className="text-base font-bold text-[#171f2e] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1485b8]" />
                <span>Log Clinical Consultation Record</span>
              </h2>
              <button
                onClick={() => setShowRecordModal(false)}
                className="text-[#6b7a8f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecordSubmit} className="space-y-3">
              <Field
                label="Select Patient"
                id="patient_id"
                type="select"
                value={recordForm.patient_id}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, patient_id: e.target.value })
                }
                options={patients.map((p) => ({
                  label: `${p.first_name} ${p.last_name} (${p.ssn_gov_id})`,
                  value: p.id,
                }))}
                required
              />

              <Field
                label="Primary Diagnosis"
                id="diagnosis"
                value={recordForm.diagnosis}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, diagnosis: e.target.value })
                }
                placeholder="e.g. Acute Bacterial Sinusitis"
                required
              />

              <Field
                label="Clinical Consultation Notes"
                id="notes"
                type="textarea"
                rows={3}
                value={recordForm.notes}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, notes: e.target.value })
                }
                placeholder="Patient presented with fever, nasal congestion, and headache..."
              />

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#e0e8f0]">
                <Button
                  variant="secondary"
                  onClick={() => setShowRecordModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Consultation Record"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
              <h2 className="text-base font-bold text-[#171f2e] flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#1485b8]" />
                <span>Issue Digital Prescription</span>
              </h2>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="text-[#6b7a8f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreatePrescriptionSubmit}
              className="space-y-3"
            >
              <Field
                label="Medication Name"
                id="medication_name"
                value={prescriptionForm.medication_name}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    medication_name: e.target.value,
                  })
                }
                placeholder="e.g. Amoxicillin"
                required
              />

              <Field
                label="Dosage"
                id="dosage"
                value={prescriptionForm.dosage}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    dosage: e.target.value,
                  })
                }
                placeholder="e.g. 500mg - 3 times daily"
                required
              />

              <Field
                label="Special Instructions"
                id="instructions"
                type="textarea"
                rows={2}
                value={prescriptionForm.instructions}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    instructions: e.target.value,
                  })
                }
                placeholder="Take after meals. Complete full 7-day course."
              />

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#e0e8f0]">
                <Button
                  variant="secondary"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Issuing..." : "Issue Digital Prescription"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
