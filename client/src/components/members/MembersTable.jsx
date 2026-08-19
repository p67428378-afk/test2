import React from "react";
import { User, Mail, Shield, CheckSquare } from "lucide-react";
import Badge from "../common/Badge";

export default function MembersTable({
  users = [],
  tasks = [],
  onSelectMember,
}) {
  const getTaskStats = (userId) => {
    const userTasks = tasks.filter((t) => t.assigned_user_id === userId);
    const active = userTasks.filter(
      (t) => t.status !== "Completed" && t.status !== "Cancelled",
    ).length;
    const completed = userTasks.filter((t) => t.status === "Completed").length;
    return { active, completed, total: userTasks.length };
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-[#707a8c] shadow-sm">
        No household members registered yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e3e8f0] bg-[#f7fafc]">
        <h3 className="text-sm font-bold text-[#171c29]">Household Roster</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Active Tasks</th>
              <th className="py-3 px-4">Completed Tasks</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0]">
            {users.map((user) => {
              const stats = getTaskStats(user.id);
              return (
                <tr key={user.id} className="hover:bg-[#f2f5fa]">
                  <td className="py-3.5 px-4 font-semibold text-[#171c29] flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2663eb] flex items-center justify-center font-bold text-xs">
                      {(user.full_name || user.email || "U")[0].toUpperCase()}
                    </div>
                    <span>{user.full_name || user.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#707a8c]">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={user.role === "admin" ? "primary" : "default"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#2663eb]">
                    {stats.active} active
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#17a34a]">
                    {stats.completed} completed
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {onSelectMember && (
                      <button
                        type="button"
                        onClick={() => onSelectMember(user)}
                        className="text-xs text-[#2663eb] hover:underline font-semibold"
                      >
                        View Assignments
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
