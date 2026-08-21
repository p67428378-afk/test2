import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  ShieldAlert,
  CheckCircle2,
  X,
  Eye,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Field from "../components/common/Field";
import Badge from "../components/common/Badge";
import { patientService } from "../services/api";

export default function PatientsPage({ user }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    ssn_gov_id: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: "Male",
    phone: "",
    emergency_contact: "",
    medical_history: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.getPatients(0, 50, query);
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch patients error:", err);
      setError("Failed to load patient directory. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchPatients(term);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      const newPatient = await patientService.createPatient(formData);
      setSuccessMsg(
        `Patient ${newPatient.first_name} ${newPatient.last_name} registered successfully! Patient ID: ${newPatient.id.slice(0, 8)}`,
      );
      setShowModal(false);
      // Reset form
      setFormData({
        ssn_gov_id: "",
        first_name: "",
        last_name: "",
        dob: "",
        gender: "Male",
        phone: "",
        emergency_contact: "",
        medical_history: "",
      });
      fetchPatients();
    } catch (err) {
      console.error("Register patient error:", err);
      // Display real backend error (e.g. duplicate SSN prompt)
      const detail =
        err.response?.data?.detail ||
        "Registration failed. Check inputs or SSN uniqueness.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Patient ID",
      accessor: "id",
      render: (row) => (
        <span className="font-mono text-xs text-[#1485b8] font-bold">
          {row.id ? row.id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "SSN / Gov ID",
      accessor: "ssn_gov_id",
      render: (row) => (
        <span className="font-mono text-xs">{row.ssn_gov_id}</span>
      ),
    },
    {
      header: "Full Name",
      accessor: "first_name",
      render: (row) => (
        <span className="font-semibold text-[#171f2e]">
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    {
      header: "DOB & Gender",
      accessor: "dob",
      render: (row) => (
        <span className="text-xs text-[#6b7a8f]">
          {row.dob} ({row.gender})
        </span>
      ),
    },
    {
      header: "Phone / Emergency",
      accessor: "phone",
      render: (row) => (
        <div className="text-xs">
          <div>{row.phone}</div>
          <div className="text-[#6b7a8f] text-[11px]">
            Emg: {row.emergency_contact}
          </div>
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
          onClick={() => setSelectedPatient(row)}
          icon={Eye}
        >
          Profile
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
            Patient Management & Directory
          </h1>
          <p className="text-xs text-[#6b7a8f]">
            Register new patients, check SSN collisions, and manage patient
            profiles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setError(null);
            setShowModal(true);
          }}
          icon={UserPlus}
        >
          Register New Patient
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

      {/* Patient Directory Data Table */}
      <DataTable
        columns={columns}
        data={patients}
        loading={loading}
        searchPlaceholder="Search by name or SSN/Gov ID..."
        onSearch={handleSearch}
        emptyMessage="No patient records found."
      />

      {/* Register Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-xl max-w-lg w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
              <h2 className="text-base font-bold text-[#171f2e] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#1485b8]" />
                <span>Register New Patient Profile</span>
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6b7a8f] hover:text-[#171f2e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <Field
                label="SSN / Government ID"
                id="ssn_gov_id"
                value={formData.ssn_gov_id}
                onChange={(e) =>
                  handleInputChange("ssn_gov_id", e.target.value)
                }
                placeholder="e.g. SSN-123-45-6789"
                helpText="Unique government identifier. Prevents duplicate registrations."
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First Name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="John"
                  required
                />
                <Field
                  label="Last Name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Date of Birth"
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  required
                />
                <Field
                  label="Gender"
                  id="gender"
                  type="select"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Phone Number"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="555-0199"
                  required
                />
                <Field
                  label="Emergency Contact"
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) =>
                    handleInputChange("emergency_contact", e.target.value)
                  }
                  placeholder="555-0198"
                  required
                />
              </div>

              <Field
                label="Medical History / Allergies"
                id="medical_history"
                type="textarea"
                rows={2}
                value={formData.medical_history}
                onChange={(e) =>
                  handleInputChange("medical_history", e.target.value)
                }
                placeholder="e.g. Penicillin allergy, Asthma"
              />

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#e0e8f0]">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Registering..." : "Save & Assign UUID"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient View Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
              <h2 className="text-base font-bold text-[#171f2e]">
                Patient Profile
              </h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-[#6b7a8f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-sm text-[#171f2e]">
              <div>
                <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                  Patient UUID
                </span>
                <span className="font-mono text-xs text-[#1485b8] font-bold">
                  {selectedPatient.id}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                    Full Name
                  </span>
                  <span className="font-medium">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                    SSN / Gov ID
                  </span>
                  <span className="font-mono text-xs">
                    {selectedPatient.ssn_gov_id}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                    DOB / Gender
                  </span>
                  <span>
                    {selectedPatient.dob} ({selectedPatient.gender})
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                    Phone
                  </span>
                  <span>{selectedPatient.phone}</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                  Emergency Contact
                </span>
                <span>{selectedPatient.emergency_contact}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-[#6b7a8f] uppercase block">
                  Medical History
                </span>
                <p className="bg-slate-50 p-2.5 rounded border border-[#e0e8f0] text-xs mt-1">
                  {selectedPatient.medical_history ||
                    "No prior medical history recorded."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#e0e8f0]">
              <Button
                variant="secondary"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
