import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  ArrowLeftRight,
  UserPlus,
  Users,
  DollarSign,
  X,
} from "lucide-react";
import { addGroupMember } from "../../services/api";

export const GroupHeaderBanner = ({
  group,
  totalExpenses = 0,
  onMemberAdded,
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!group) return null;

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberName.trim()) {
      setError("Member name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await addGroupMember(group.id, {
        name: memberName.trim(),
        email: memberEmail.trim() || null,
      });
      setMemberName("");
      setMemberEmail("");
      setIsAddMemberOpen(false);
      if (onMemberAdded) onMemberAdded();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {group.name}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              <Users className="w-3 h-3 mr-1" />
              {group.members?.length || 0} Members
            </span>
          </div>
          {group.description && (
            <p className="text-slate-600 text-sm">{group.description}</p>
          )}

          <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Total Expenses
              </span>
              <span className="text-xl font-bold text-slate-900 flex items-center">
                <DollarSign className="w-5 h-5 text-emerald-600 -mr-1" />
                {Number(totalExpenses).toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Members
              </span>
              <div className="flex -space-x-2 mt-1">
                {(group.members || []).map((m, idx) => (
                  <div
                    key={m.id || idx}
                    title={`${m.name}${m.email ? ` (${m.email})` : ""}`}
                    className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white uppercase"
                  >
                    {m.name.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors inline-flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>

          <Link
            to={`/expense/new?group_id=${group.id}`}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm inline-flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Expense</span>
          </Link>

          <Link
            to={`/settlements?group_id=${group.id}`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm inline-flex items-center space-x-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Settle Up</span>
          </Link>
        </div>
      </div>

      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Add Group Member
              </h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Member Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. User A"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupHeaderBanner;
