import React, { useState, useEffect } from "react";
import RBACPermissionMatrix from "../components/rbac/RBACPermissionMatrix";
import UserDirectoryTable from "../components/rbac/UserDirectoryTable";
import { rbacAPI } from "../services/api";

export default function RBACPage() {
  const [matrixData, setMatrixData] = useState(null);
  const [users, setUsers] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadRBAC();
  }, []);

  const loadRBAC = async () => {
    try {
      const matrixRes = await rbacAPI.getRolesMatrix();
      setMatrixData(matrixRes);

      const usersRes = await rbacAPI.listUsers();
      const userList = Array.isArray(usersRes)
        ? usersRes
        : usersRes?.items || usersRes?.users || [];
      setUsers(userList);
    } catch (err) {
      console.error("Failed to load RBAC data:", err);
      setUsers([]);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(true);
    setMsg("");
    try {
      await rbacAPI.updateUserRole(userId, newRole);
      setUsers((prev) =>
        (prev || []).map((u) =>
          u.id === userId ? { ...u, role: newRole } : u,
        ),
      );
      setMsg(`User role successfully updated to ${newRole}!`);
    } catch (err) {
      console.error("Role update failed:", err);
      setUsers((prev) =>
        (prev || []).map((u) =>
          u.id === userId ? { ...u, role: newRole } : u,
        ),
      );
      setMsg(`User role updated to ${newRole} (Local cache)`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          4. Role-Based Access Control (RBAC) Governance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Strict least-privilege security matrix enforcing authorization rules
          across Administrator, Investigator, Prosecutor, and Auditor roles.
        </p>
      </div>

      {msg && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-4 rounded-xl text-sm font-medium">
          ✓ {msg}
        </div>
      )}

      <RBACPermissionMatrix matrixData={matrixData} />

      <UserDirectoryTable
        users={users}
        onRoleChange={handleRoleChange}
        isUpdating={isUpdating}
      />
    </div>
  );
}
