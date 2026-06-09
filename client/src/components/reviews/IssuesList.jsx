import React from 'react';

export default function IssuesList({ issues = [], onSelectIssue, selectedIssueId }) {
  if (issues.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-emerald-400 text-4xl">check_circle</span>
        <h3 className="font-sans font-semibold text-on-surface">No Issues Found</h3>
        <p className="font-sans text-xs text-on-surface-variant max-w-xs">
          This code review is clean! No security vulnerabilities or code quality issues were detected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-sans font-semibold text-on-surface text-sm uppercase tracking-wider text-on-surface-variant">
        Detected Issues ({issues.length})
      </h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {issues.map((issue) => {
          const isSelected = selectedIssueId === issue.issue_id;
          const isCritical = issue.severity === 'CRITICAL' || issue.severity === 'HIGH';

          return (
            <div
              key={issue.issue_id}
              onClick={() => onSelectIssue && onSelectIssue(issue)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-surface-variant border-primary shadow-lg scale-[1.01]'
                  : 'glass-card hover:border-outline'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isCritical ? 'bg-error' : 'bg-amber-400'}`}></span>
                  <span className={`font-sans font-bold text-[10px] uppercase tracking-wider ${isCritical ? 'text-error' : 'text-amber-400'}`}>
                    {issue.severity}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant">
                  Line {issue.line_number}
                </span>
              </div>

              <p className="font-sans text-xs text-on-surface mt-2 font-medium">
                {issue.message}
              </p>

              <div className="flex items-center gap-1.5 mt-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-xs">description</span>
                <span className="font-mono text-[10px] truncate max-w-[200px]">
                  {issue.file_path}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
