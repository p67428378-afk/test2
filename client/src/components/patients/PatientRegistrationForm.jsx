import React, { useState } from "react";
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createPatient } from "../../services/api";

export default function PatientRegistrationForm({ onPatientCreated }) {
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Male",
    phone: "",
    emergency_contact: "",
    medical_history: "",
    insurance_provider: "",
    insurance_policy_number: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone: formData.phone,
        emergency_contact: formData.emergency_contact,
        medical_history: formData.medical_history || null,
        insurance_provider: formData.insurance_provider || null,
        insurance_policy_number: formData.insurance_policy_number || null,
      };

      const res = await createPatient(payload);
      setSuccessMsg(`Patient registered successfully! ID: ${res.id}`);
      setFormData({
        full_name: "",
        date_of_birth: "",
        gender: "Male",
        phone: "",
        emergency_contact: "",
        medical_history: "",
        insurance_provider: "",
        insurance_policy_number: "",
      });
      if (onPatientCreated) {
        onPatientCreated(res);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to register patient";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">
            New Patient Registration
          </h2>
          <p className="text-xs text-slate-500">
            Register demographic and insurance details
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              name="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 555-0192"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Emergency Contact *
            </label>
            <input
              type="text"
              name="emergency_contact"
              required
              value={formData.emergency_contact}
              onChange={handleChange}
              placeholder="e.g. Jane Doe (Spouse) - +1 555-0199"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Insurance Provider
            </label>
            <input
              type="text"
              name="insurance_provider"
              value={formData.insurance_provider}
              onChange={handleChange}
              placeholder="e.g. BlueCross"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Policy Number
            </label>
            <input
              type="text"
              name="insurance_policy_number"
              value={formData.insurance_policy_number}
              onChange={handleChange}
              placeholder="e.g. POL-99201"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical History Notes
            </label>
            <textarea
              name="medical_history"
              rows="2"
              value={formData.medical_history}
              onChange={handleChange}
              placeholder="Known allergies, chronic conditions, prior surgeries..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
}
