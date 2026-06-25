import React from "react";

export default function SweepRulesTable({
  rules,
  accounts,
  onEdit,
  onDelete,
  loading,
}) {
  if (loading) {
    return (
      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-lg animate-pulse h-48" />
    );
  }

  const getAccountName = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? `${acc.name} (${acc.currency})` : id;
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-surface-container-highest/30 border-b border-outline-variant">
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Source Account
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Central Hub
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Target Balance
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                Sweep Threshold
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50 font-mono text-data-mono">
            {rules.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-sm py-8 text-center text-on-surface-variant"
                >
                  No sweep rules configured.
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="hover:bg-surface-container-high/30 transition-colors"
                >
                  <td className="px-sm py-sm text-on-surface">
                    {getAccountName(rule.source_account_id)}
                  </td>
                  <td className="px-sm py-sm text-on-surface-variant">
                    {getAccountName(rule.hub_account_id)}
                  </td>
                  <td className="px-sm py-sm text-on-surface text-right">
                    $
                    {rule.target_balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-sm py-sm text-on-surface text-right">
                    $
                    {rule.sweep_threshold.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-sm py-sm text-on-surface-variant">
                    {rule.schedule}
                  </td>
                  <td className="px-sm py-sm text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-sm font-label-caps text-[10px] ${
                        rule.status === "ACTIVE"
                          ? "bg-tertiary/10 text-tertiary"
                          : "bg-outline-variant text-on-surface-variant"
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-sm py-sm text-center space-x-2">
                    <button
                      onClick={() => onEdit(rule)}
                      className="text-primary hover:text-primary-fixed transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => onDelete(rule.id)}
                      className="text-error hover:text-red-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
