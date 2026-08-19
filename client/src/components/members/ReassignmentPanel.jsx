import React, { useState } from "react";
import { UserCheck, ArrowRightLeft } from "lucide-react";
import Button from "../common/Button";

export default function ReassignmentPanel({
  tasks = [],
  users = [],
  onReassign,
}) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || "");
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTaskId) return;

    setLoading(true);
    setMessage("");
    try {
      await onReassign(selectedTaskId, selectedUserId || null);
      setMessage("Task reassigned successfully!");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to reassign task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm">
      <div className="flex items-center space-x-2 text-[#2663eb] mb-3">
        <ArrowRightLeft className="w-5 h-5" />
        <h3 className="text-sm font-bold text-[#171c29]">
          Quick Task Reassignment
        </h3>
      </div>
      <p className="text-xs text-[#707a8c] mb-4">
        Reassign pending or overdue tasks when a household member is unavailable
        or role changes occur.
      </p>

      {message && (
        <div
          className={`p-2.5 rounded-lg text-xs font-medium mb-3 ${
            message.includes("successfully")
              ? "bg-green-50 text-[#17a34a]"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#171c29] mb-1">
            Select Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            <option value="" disabled>
              Select a task
            </option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#171c29] mb-1">
            Assign To Member
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name || u.email}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !selectedTaskId}
          className="w-full"
        >
          {loading ? "Reassigning..." : "Confirm Reassignment"}
        </Button>
      </form>
    </div>
  );
}
