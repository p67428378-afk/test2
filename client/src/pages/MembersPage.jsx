import React, { useState, useEffect } from "react";
import { Users, UserPlus, ArrowRightLeft } from "lucide-react";
import MembersTable from "../components/members/MembersTable";
import ReassignmentPanel from "../components/members/ReassignmentPanel";
import StatCard from "../components/common/StatCard";
import { usersAPI, tasksAPI } from "../services/api";

export default function MembersPage() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMembersAndTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const [uRes, tRes] = await Promise.all([
        usersAPI.listUsers().catch(() => []),
        tasksAPI.listTasks().catch(() => []),
      ]);
      setUsers(uRes || []);
      setTasks(tRes || []);
    } catch (err) {
      setError("Failed to fetch household members and task assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersAndTasks();
  }, []);

  const handleReassign = async (taskId, assignedUserId) => {
    await tasksAPI.assignTask(taskId, assignedUserId);
    fetchMembersAndTasks();
  };

  const totalMembers = users.length;
  const totalAssignedTasks = tasks.filter((t) => t.assigned_user_id).length;
  const unassignedTasks = tasks.filter((t) => !t.assigned_user_id).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Household Members & Assignments
        </h1>
        <p className="text-xs text-[#707a8c] mt-0.5">
          View member workloads, roles, and reassign maintenance tasks across
          household members.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Members"
          value={totalMembers}
          subtext="Active household members"
          icon={Users}
        />
        <StatCard
          label="Assigned Tasks"
          value={totalAssignedTasks}
          subtext="Tasks allocated to members"
          icon={Users}
        />
        <StatCard
          label="Unassigned Tasks"
          value={unassignedTasks}
          subtext="Needs assignment"
          badgeText={
            unassignedTasks > 0
              ? `${unassignedTasks} Unassigned`
              : "All Assigned"
          }
          badgeVariant={unassignedTasks > 0 ? "warning" : "success"}
          icon={ArrowRightLeft}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center text-sm text-[#707a8c]">
          Loading household roster...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Roster Table (2 cols) */}
          <div className="lg:col-span-2">
            <MembersTable
              users={users}
              tasks={tasks}
              onSelectMember={(u) => setSelectedMember(u)}
            />
          </div>

          {/* Quick Reassignment Panel (1 col) */}
          <div>
            <ReassignmentPanel
              tasks={tasks}
              users={users}
              onReassign={handleReassign}
            />
          </div>
        </div>
      )}
    </div>
  );
}
