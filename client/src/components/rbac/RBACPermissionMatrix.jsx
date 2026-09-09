import React from "react";
import { Lock, Check, X, ShieldAlert } from "lucide-react";

export default function RBACPermissionMatrix({ matrixData }) {
  const defaultRoles = [
    "Administrator",
    "Lead Investigator",
    "Investigator",
    "Prosecutor",
    "External Auditor",
    "Read-Only Observer",
  ];

  const defaultCapabilities = [
    {
      capability: "Upload Evidence & Hash",
      permissions: {
        Administrator: "✓ Yes",
        "Lead Investigator": "✓ Yes",
        Investigator: "✓ Yes",
        Prosecutor: "✕ No",
        "External Auditor": "✕ No",
        "Read-Only Observer": "✕ No",
      },
    },
    {
      capability: "View Evidence & Custody Ledger",
      permissions: {
        Administrator: "✓ Yes",
        "Lead Investigator": "✓ Yes",
        Investigator: "Assigned Cases",
        Prosecutor: "Assigned Cases",
        "External Auditor": "Read-Only",
        "Read-Only Observer": "Read-Only",
      },
    },
    {
      capability: "Transfer Custody (Sign-Off)",
      permissions: {
        Administrator: "✓ Yes",
        "Lead Investigator": "✓ Yes",
        Investigator: "✓ Yes",
        Prosecutor: "Accept Only",
        "External Auditor": "✕ No",
        "Read-Only Observer": "✕ No",
      },
    },
    {
      capability: "Assign Evidence to Cases",
      permissions: {
        Administrator: "✓ Yes",
        "Lead Investigator": "✓ Yes",
        Investigator: "✓ Yes",
        Prosecutor: "✕ No",
        "External Auditor": "✕ No",
        "Read-Only Observer": "✕ No",
      },
    },
    {
      capability: "View System Audit Logs",
      permissions: {
        Administrator: "✓ Yes",
        "Lead Investigator": "✓ Yes",
        Investigator: "✕ No",
        Prosecutor: "✕ No",
        "External Auditor": "✓ Yes",
        "Read-Only Observer": "✕ No",
      },
    },
    {
      capability: "User & Role Administration",
      permissions: {
        Administrator: "✓ Yes",
        "Lead Investigator": "✕ No",
        Investigator: "✕ No",
        Prosecutor: "✕ No",
        "External Auditor": "✕ No",
        "Read-Only Observer": "✕ No",
      },
    },
  ];

  const roles = matrixData?.roles || defaultRoles;

  const renderCell = (val) => {
    if (val === "✓ Yes") {
      return (
        <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
          <Check className="w-4 h-4" /> Yes
        </span>
      );
    }
    if (val === "✕ No") {
      return (
        <span className="text-red-400/80 font-medium inline-flex items-center gap-1">
          <X className="w-4 h-4" /> No
        </span>
      );
    }
    return (
      <span className="text-amber-400 font-medium text-xs px-2 py-0.5 bg-amber-950/40 rounded border border-amber-800/40">
        {val}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-400" />
          <span>Role-Based Access Control (RBAC) Permission Matrix</span>
        </h2>
        <span className="text-xs bg-slate-950 border border-slate-800 text-slate-400 px-3 py-1 rounded-full">
          6 System Roles
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 border-collapse border border-slate-800">
          <thead className="bg-slate-950 text-slate-400 text-xs border-b border-slate-800">
            <tr>
              <th className="p-3 border border-slate-800 min-w-[200px]">
                Capability / Action
              </th>
              {roles.map((r) => (
                <th
                  key={r}
                  className="p-3 border border-slate-800 font-bold text-slate-200 text-center"
                >
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {defaultCapabilities.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-medium border border-slate-800 text-slate-200">
                  {row.capability}
                </td>
                {roles.map((r) => (
                  <td
                    key={r}
                    className="p-3 border border-slate-800 text-center text-xs"
                  >
                    {renderCell(row.permissions[r] || "✕ No")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
