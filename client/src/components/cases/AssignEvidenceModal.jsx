import React, { useState } from "react";
import Modal from "../common/Modal";
import { Plus, Search, Check } from "lucide-react";

export default function AssignEvidenceModal({
  isOpen,
  onClose,
  unassignedEvidence = [],
  onAssignSubmit,
  isSubmitting,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvidence = unassignedEvidence.filter(
    (item) =>
      item.evidence_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.file_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    if (onAssignSubmit) {
      onAssignSubmit(selectedIds);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Evidence Items to Case"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search unassigned evidence by code or filename..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {filteredEvidence.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No unassigned evidence artifacts found.
            </p>
          ) : (
            filteredEvidence.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-950/50 border-blue-600/80 text-slate-100"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold font-mono text-blue-400">
                      {item.evidence_code}
                    </p>
                    <p className="text-xs text-slate-300">{item.file_name}</p>
                    <p className="text-[10px] text-slate-500 font-mono break-all">
                      {item.sha256_hash}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center border ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-slate-400">
            {selectedIds.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedIds.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? "Linking..." : "Link to Case"}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
