import React from "react";
import { Filter, Download, MoreVertical } from "lucide-react";

const ActiveRulesTable = ({ rules, onSelectRule, selectedRuleId }) => {
  return (
    <div className="bento-card rounded-xl overflow-hidden border border-outline-variant">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container">
        <h3 className="text-headline-sm font-headline-sm">
          Active Sweeping Rules
        </h3>
        <div className="flex gap-2">
          <button className="p-2 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-2 border border-outline-variant rounded hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
              <th className="px-6 py-4">Rule ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Source Accounts</th>
              <th className="px-6 py-4">Target Account</th>
              <th className="px-6 py-4 text-right">Threshold</th>
              <th className="px-6 py-4">Frequency</th>
              <th className="px-6 py-4">FX Strategy</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {rules.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-8 text-center text-on-surface-variant"
                >
                  No sweeping rules found. Create one above!
                </td>
              </tr>
            ) : (
              rules.map((rule) => {
                const isSelected = selectedRuleId === rule.id;
                return (
                  <tr
                    key={rule.id}
                    onClick={() => onSelectRule(rule)}
                    className={`hover:bg-surface-container-high transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-surface-container-high border-l-4 border-indigo-accent"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-data-mono text-data-mono text-xs">
                      {rule.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 font-bold">{rule.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant text-sm">
                      {rule.source_accounts.join(", ")}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-sm">
                      {rule.target_account}
                    </td>
                    <td className="px-6 py-4 text-right font-data-mono text-sm">
                      ${rule.threshold.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{rule.frequency}</td>
                    <td className="px-6 py-4 text-sm uppercase">
                      {rule.fx_strategy}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rule.status === "APPROVED" || rule.status === "ACTIVE"
                            ? "bg-green-900/20 text-green-400"
                            : rule.status === "PAUSED"
                              ? "bg-yellow-900/20 text-yellow-400"
                              : rule.status === "REJECTED"
                                ? "bg-red-900/20 text-red-400"
                                : "bg-blue-900/20 text-blue-400"
                        }`}
                      >
                        {rule.status}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="text-on-surface-variant hover:text-indigo-accent">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveRulesTable;
