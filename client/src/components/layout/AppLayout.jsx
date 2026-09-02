import React, { useState } from "react";
import Navbar from "./Navbar";
import { Plus, X } from "lucide-react";

export const AppLayout = ({
  children,
  groups = [],
  selectedGroupId,
  onSelectGroup,
  onCreateGroup,
}) => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupNameDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [groupError, setGroupError] = useState("");

  const handleCreateGroupSubmit = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      setGroupError("Group name is required.");
      return;
    }
    setGroupError("");
    setCreating(true);
    try {
      await onCreateGroup({
        name: newGroupName.trim(),
        description: newGroupDesc.trim(),
      });
      setNewGroupName("");
      setNewGroupNameDesc("");
      setIsGroupModalOpen(false);
    } catch (err) {
      setGroupError(
        err.response?.data?.detail || err.message || "Failed to create group",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        groups={groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={onSelectGroup}
        onCreateGroupModal={() => setIsGroupModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>
          Shared Bill Splitter &copy; 2026. Seamless expense entry &amp;
          individual share calculation.
        </p>
      </footer>

      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Create New Expense Group
              </h3>
              <button
                onClick={() => setIsGroupModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {groupError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {groupError}
              </div>
            )}

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Vacation 2026, Roommates"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Group purpose or details..."
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupNameDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 inline-flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>{creating ? "Creating..." : "Create Group"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
