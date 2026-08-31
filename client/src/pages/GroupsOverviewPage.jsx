import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGroups, createGroup } from "../services/api";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import {
  Users,
  DollarSign,
  ArrowRightLeft,
  Plus,
  Receipt,
  ArrowRight,
  Loader2,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";

export default function GroupsOverviewPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Group Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState([
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
  ]);
  const [modalError, setModalError] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getGroups();
      setGroups(data || []);
    } catch (err) {
      setError(
        "Failed to load groups. Please check if the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const handleRemoveMember = (idx) => {
    if (members.length <= 1) return;
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx, field, val) => {
    const updated = [...members];
    updated[idx][field] = val;
    setMembers(updated);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setModalError(null);

    if (!groupName.trim()) {
      setModalError("Group name is required.");
      return;
    }

    const validMembers = members
      .map((m) => ({ name: m.name.trim(), email: m.email?.trim() || null }))
      .filter((m) => m.name.length > 0);

    if (validMembers.length === 0) {
      setModalError("Please add at least one valid group member.");
      return;
    }

    setModalSubmitting(true);
    try {
      const payload = {
        name: groupName.trim(),
        description: groupDescription.trim() || null,
        members: validMembers,
      };
      await createGroup(payload);
      setIsModalOpen(false);
      setGroupName("");
      setGroupDescription("");
      setMembers([
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" },
      ]);
      await fetchGroups();
    } catch (err) {
      setModalError(err.response?.data?.detail || "Failed to create group.");
    } finally {
      setModalSubmitting(false);
    }
  };

  const totalSpent = groups.reduce((acc, g) => acc + (g.total_spent || 0), 0);
  const totalMembers = groups.reduce(
    (acc, g) => acc + (g.member_count || g.members?.length || 0),
    0,
  );

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val) || 0);
  };

  return (
    <div className="space-y-8">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171C29] tracking-tight">
            Groups Overview
          </h1>
          <p className="text-sm text-[#707A8C] mt-1">
            Manage your shared expense groups, view balances, and coordinate
            split payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Groups"
          value={`${groups.length} Groups`}
          subtitle="All active expense groups"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Group Expenses"
          value={formatCurrency(totalSpent)}
          subtitle="Aggregated across all groups"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Participants"
          value={`${totalMembers} Members`}
          subtitle="Group members active"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Settlements System"
          value="Active"
          subtitle="Instant debt simplification"
          icon={ArrowRightLeft}
          color="amber"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Connection Error
            </p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
            <button
              onClick={fetchGroups}
              className="mt-2 text-xs font-semibold text-red-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-16 bg-white border border-[#E3E8F0] rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-[#707A8C]">Loading expense groups...</p>
        </div>
      ) : groups.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 px-4 bg-white border border-[#E3E8F0] rounded-xl shadow-sm">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-[#171C29]">
            No Expense Groups Yet
          </h2>
          <p className="text-sm text-[#707A8C] mt-1 max-w-md mx-auto">
            Create your first group to start entering shared expenses and
            calculating individual split shares.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Your First Group
          </button>
        </div>
      ) : (
        /* Groups Grid */
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#171C29]">
              Your Groups ({groups.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group) => {
              const membersCount =
                group.member_count || group.members?.length || 0;
              return (
                <div
                  key={group.id}
                  className="bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base text-[#171C29] line-clamp-1">
                        {group.name}
                      </h3>
                      <Badge variant="primary" size="sm">
                        {membersCount}{" "}
                        {membersCount === 1 ? "member" : "members"}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#707A8C] line-clamp-2 min-h-[32px]">
                      {group.description || "No description provided."}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-[#707A8C] uppercase font-semibold">
                          Total Expenses
                        </p>
                        <p className="text-lg font-bold text-[#171C29] mt-0.5">
                          {formatCurrency(group.total_spent || 0)}
                        </p>
                      </div>

                      {/* Member Avatars */}
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {(group.members || []).slice(0, 3).map((m, idx) => (
                          <div
                            key={m.id || idx}
                            title={m.name}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center"
                          >
                            {(m.name || "M").substring(0, 2).toUpperCase()}
                          </div>
                        ))}
                        {(group.members || []).length > 3 && (
                          <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center">
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      to={`/groups/${group.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      Expenses
                    </Link>
                    <Link
                      to={`/settlements?groupId=${group.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-[#707A8C] hover:text-[#171C29] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      Settlements
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#E3E8F0] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
              <h3 className="text-lg font-bold text-[#171C29]">
                Create New Expense Group
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateGroup} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171C29] mb-1">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. NYC Weekend Trip, Roommates, Office Lunch"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171C29] mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Optional details about this expense group..."
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#171C29]">
                    Group Members <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Member
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {members.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Member Name (e.g. Alice)"
                        value={m.name}
                        onChange={(e) =>
                          handleMemberChange(idx, "name", e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email (optional)"
                        value={m.email}
                        onChange={(e) =>
                          handleMemberChange(idx, "email", e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E3E8F0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#707A8C] hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {modalSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
