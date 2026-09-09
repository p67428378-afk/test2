import React, { useState, useEffect } from "react";
import CaseSummaryCard from "../components/cases/CaseSummaryCard";
import LinkedEvidenceTable from "../components/cases/LinkedEvidenceTable";
import AssignEvidenceModal from "../components/cases/AssignEvidenceModal";
import Modal from "../components/common/Modal";
import { casesAPI, evidenceAPI } from "../services/api";
import { Plus, Briefcase } from "lucide-react";

export default function CaseDashboardPage() {
  const [stats, setStats] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [unassignedEvidence, setUnassignedEvidence] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create Case Form state
  const [newCaseNumber, setNewCaseNumber] = useState("CASE-2026-090");
  const [newTitle, setNewTitle] = useState("Financial Misconduct & Wire Fraud");
  const [newDesc, setNewDesc] = useState(
    "Investigation into unauthorized wire transfers",
  );

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsRes = await casesAPI.getStats();
      setStats(statsRes);

      const casesRes = await casesAPI.listCases();
      const caseList = Array.isArray(casesRes)
        ? casesRes
        : casesRes?.items || casesRes?.cases || [];
      setCases(caseList);

      if (caseList.length > 0) {
        fetchCaseDetails(caseList[0].id, caseList[0]);
      }

      const evRes = await evidenceAPI.listEvidence();
      const allEv = Array.isArray(evRes) ? evRes : evRes?.items || [];
      setUnassignedEvidence(
        allEv.filter(
          (e) => !e.assigned_case_ids || e.assigned_case_ids.length === 0,
        ),
      );
    } catch (err) {
      console.error("Failed to load cases data:", err);
    }
  };

  const fetchCaseDetails = async (caseId, fallbackCase = null) => {
    try {
      const details = await casesAPI.getCase(caseId);
      setSelectedCase(details);
    } catch (err) {
      console.error("Fetch case error:", err);
      if (fallbackCase) {
        setSelectedCase(fallbackCase);
      }
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await casesAPI.createCase({
        case_number: newCaseNumber,
        title: newTitle,
        description: newDesc,
        status: "Active",
      });
      setCases((prev) => [created, ...prev]);
      setSelectedCase(created);
      setIsCreateCaseOpen(false);
    } catch (err) {
      console.error("Case creation failed:", err);
      const mockCreated = {
        id: `cs-${Date.now()}`,
        case_number: newCaseNumber,
        title: newTitle,
        description: newDesc,
        status: "Active",
        evidence_items: [],
      };
      setCases((prev) => [mockCreated, ...prev]);
      setSelectedCase(mockCreated);
      setIsCreateCaseOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (evidenceIds) => {
    if (!selectedCase) return;
    setIsSubmitting(true);
    try {
      const updatedCase = await casesAPI.assignEvidence(
        selectedCase.id,
        evidenceIds,
      );
      setSelectedCase(updatedCase);
      setIsAssignModalOpen(false);
      loadDashboardData();
    } catch (err) {
      console.error("Assign failed:", err);
      setIsAssignModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassign = async (evidenceId) => {
    if (!selectedCase) return;
    try {
      const updatedCase = await casesAPI.unassignEvidence(
        selectedCase.id,
        evidenceId,
      );
      setSelectedCase(updatedCase);
      loadDashboardData();
    } catch (err) {
      console.error("Unassign failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            3. Case Assignment & Evidence Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Group digital evidence items under investigative cases, manage
            dossiers, and link artifacts.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsCreateCaseOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm rounded-lg transition-colors flex items-center gap-2 border border-slate-700"
          >
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>New Case Dossier</span>
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Link Evidence to Case</span>
          </button>
        </div>
      </div>

      <CaseSummaryCard stats={stats} />

      {/* Case Selector Tabs */}
      {cases.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => fetchCaseDetails(c.id, c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ${
                selectedCase?.id === c.id
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/50"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {c.case_number}: {c.title}
            </button>
          ))}
        </div>
      )}

      {selectedCase && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md mb-6 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Case Dossier: {selectedCase.case_number}
              </h2>
              <p className="text-sm font-medium text-blue-400">
                {selectedCase.title}
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-950 text-blue-400 border border-blue-800 text-xs rounded-full font-mono">
              STATUS: {selectedCase.status || "Active"}
            </span>
          </div>
          <p className="text-xs text-slate-400">{selectedCase.description}</p>
        </div>
      )}

      <LinkedEvidenceTable
        caseNumber={selectedCase?.case_number || "CASE-2026-089"}
        evidenceItems={selectedCase?.evidence_items}
        onUnassign={handleUnassign}
      />

      <AssignEvidenceModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        unassignedEvidence={unassignedEvidence}
        onAssignSubmit={handleAssignSubmit}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
        title="Create New Investigative Case Dossier"
      >
        <form onSubmit={handleCreateCase} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Case Number Code
            </label>
            <input
              type="text"
              value={newCaseNumber}
              onChange={(e) => setNewCaseNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Case Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Description
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateCaseOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"
            >
              {isSubmitting ? "Creating..." : "Create Case Dossier"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
