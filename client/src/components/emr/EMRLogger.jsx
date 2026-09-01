import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createEMRRecord } from "../../services/api";

export default function EMRLogger({ onEMRRecordCreated }) {
  const [formData, setFormData] = useState({
    appointment_id: "",
    patient_id: "",
    doctor_id: "",
    diagnosis: "",
    clinical_notes: "",
  });

  const [prescriptions, setPrescriptions] = useState([
    { medication: "", dosage: "", frequency: "", duration: "" },
  ]);

  const [labOrders, setLabOrders] = useState([{ test_name: "", notes: "" }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAddPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      { medication: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrescriptionChange = (index, field, value) => {
    setPrescriptions((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddLabOrder = () => {
    setLabOrders((prev) => [...prev, { test_name: "", notes: "" }]);
  };

  const handleRemoveLabOrder = (index) => {
    setLabOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLabOrderChange = (index, field, value) => {
    setLabOrders((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        appointment_id: formData.appointment_id,
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        diagnosis: formData.diagnosis,
        clinical_notes: formData.clinical_notes,
        prescriptions: prescriptions.filter((p) => p.medication.trim() !== ""),
        lab_orders: labOrders.filter((l) => l.test_name.trim() !== ""),
      };

      const res = await createEMRRecord(payload);
      setSuccessMsg(`EMR record saved successfully! ID: ${res.id}`);
      setFormData({
        appointment_id: "",
        patient_id: "",
        doctor_id: "",
        diagnosis: "",
        clinical_notes: "",
      });
      setPrescriptions([
        { medication: "", dosage: "", frequency: "", duration: "" },
      ]);
      setLabOrders([{ test_name: "", notes: "" }]);

      if (onEMRRecordCreated) onEMRRecordCreated(res);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to save EMR record";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">
            EMR & Clinical Session Editor
          </h2>
          <p className="text-xs text-slate-500">
            Record SOAP clinical notes, diagnoses, and lab requisitions
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Identifiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Appointment UUID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              value={formData.appointment_id}
              onChange={(e) =>
                setFormData({ ...formData, appointment_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Patient UUID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440001"
              value={formData.patient_id}
              onChange={(e) =>
                setFormData({ ...formData, patient_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Doctor UUID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440002"
              value={formData.doctor_id}
              onChange={(e) =>
                setFormData({ ...formData, doctor_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Primary Diagnosis *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Acute Bronchitis (ICD-10: J20.9)"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Clinical Notes (SOAP) */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Clinical Notes (SOAP) *
          </label>
          <textarea
            rows="4"
            required
            placeholder="Subjective, Objective, Assessment, Plan notes..."
            value={formData.clinical_notes}
            onChange={(e) =>
              setFormData({ ...formData, clinical_notes: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        {/* Prescriptions Table */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700">Prescriptions</span>
            <button
              type="button"
              onClick={handleAddPrescription}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Drug</span>
            </button>
          </div>

          <div className="space-y-2">
            {prescriptions.map((p, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Medication name"
                  value={p.medication}
                  onChange={(e) =>
                    handlePrescriptionChange(
                      index,
                      "medication",
                      e.target.value,
                    )
                  }
                  className="col-span-4 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 500mg)"
                  value={p.dosage}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "dosage", e.target.value)
                  }
                  className="col-span-3 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g. BID)"
                  value={p.frequency}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "frequency", e.target.value)
                  }
                  className="col-span-2 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={p.duration}
                  onChange={(e) =>
                    handlePrescriptionChange(index, "duration", e.target.value)
                  }
                  className="col-span-2 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePrescription(index)}
                  className="col-span-1 text-slate-400 hover:text-rose-600 flex justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Orders */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-700">
              Lab Orders & Requisitions
            </span>
            <button
              type="button"
              onClick={handleAddLabOrder}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Lab Order</span>
            </button>
          </div>

          <div className="space-y-2">
            {labOrders.map((l, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Test Name (e.g. Complete Blood Count)"
                  value={l.test_name}
                  onChange={(e) =>
                    handleLabOrderChange(index, "test_name", e.target.value)
                  }
                  className="col-span-5 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <input
                  type="text"
                  placeholder="Instructions/Notes"
                  value={l.notes}
                  onChange={(e) =>
                    handleLabOrderChange(index, "notes", e.target.value)
                  }
                  className="col-span-6 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLabOrder(index)}
                  className="col-span-1 text-slate-400 hover:text-rose-600 flex justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save EMR Clinical Record</span>
          </button>
        </div>
      </form>
    </div>
  );
}
