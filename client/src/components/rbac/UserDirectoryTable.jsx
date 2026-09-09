import React from "react";
import { Users, Shield, ShieldCheck, UserCheck } from "lucide-react";
import Badge from "../common/Badge";

export default function UserDirectoryTable({
  users = [],
  onRoleChange,
  isUpdating,
}) {
  const defaultUsers = [
    {
      id: "usr-1",
      email: "alice@police.gov",
      full_name: "Investigator Alice",
      role: "Investigator",
      is_active: true,
    },
    {
      id: "usr-2",
      email: "bob@prosecution.gov",
      full_name: "Lead Prosecutor Bob",
      role: "Prosecutor",
      is_active: true,
    },
    {
      id: "usr-3",
      email: "charlie@police.gov",
      full_name: "Investigator Charlie",
      role: "Investigator",
      is_active: true,
    },
    {
      id: "usr-4",
      email: "admin@dems.gov",
      full_name: "Admin User",
      role: "Administrator",
      is_active: true,
    },
    {
      id: "usr-5",
      email: "auditor@external.gov",
      full_name: "Auditor Jane",
      role: "External Auditor",
      is_active: true,
    },
  ];

  const displayUsers = users.length > 0 ? users : defaultUsers;

  const rolesList = [
    "Administrator",
    "Lead Investigator",
    "Investigator",
    "Prosecutor",
    "External Auditor",
    "Read-Only Observer",
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span>Authorized System Users ({displayUsers.length})</span>
        </h3>
        <Badge variant="success">
          <UserCheck className="w-3.5 h-3.5" />
          <span>MFA HARDWARE TOKEN VERIFIED</span>
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">User Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">Security Level</th>
              <th className="p-3 text-right">Role Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayUsers.map((u) => (
              <tr
                key={u.id}
                className="hover:bg-slate-800/40 transition-colors"
              >
                <td className="p-3 font-semibold text-slate-200">
                  {u.full_name || "N/A"}
                </td>
                <td className="p-3 font-mono text-xs text-blue-400">
                  {u.email}
                </td>
                <td className="p-3">
                  <Badge
                    variant={
                      u.role === "Administrator"
                        ? "purple"
                        : u.role === "External Auditor"
                          ? "warning"
                          : "info"
                    }
                  >
                    {u.role}
                  </Badge>
                </td>
                <td className="p-3 text-xs text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>CJIS L4 Cleared</span>
                </td>
                <td className="p-3 text-right">
                  {onRoleChange && (
                    <select
                      value={u.role}
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                      disabled={isUpdating}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                    >
                      {rolesList.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
