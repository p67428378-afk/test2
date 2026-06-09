import React, { useState } from 'react';

export default function CodeViewer({ filePath, issues = [] }) {
  // Mock code content for demonstration
  const mockCodeLines = [
    "import os",
    "import sys",
    "from fastapi import FastAPI, HTTPException",
    "",
    "app = FastAPI()",
    "",
    "@app.get('/api/v1/data')",
    "def get_data(user_id: str):",
    "    # TODO: Implement proper authentication",
    "    db_conn = 'postgresql://admin:super_secret_password_123@localhost:5432/db'",
    "    if not user_id:",
    "        raise HTTPException(status_code=400, detail='Missing user_id')",
    "    ",
    "    # Execute raw query",
    "    query = f'SELECT * FROM users WHERE id = {user_id}'",
    "    return {'status': 'success', 'data': query}",
  ];

  const issuesByLine = issues.reduce((acc, issue) => {
    acc[issue.line_number] = issue;
    return acc;
  }, {});

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-outline-variant">
      <div className="px-6 py-4 bg-surface-container/50 border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">code</span>
          <span className="font-mono text-sm text-on-surface font-semibold">{filePath || 'Select a file to view code'}</span>
        </div>
        <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-2 py-1 rounded">
          {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
        </span>
      </div>

      <div className="overflow-x-auto font-mono text-xs p-4 bg-surface-container-lowest">
        <table className="w-full border-collapse">
          <tbody>
            {mockCodeLines.map((line, index) => {
              const lineNumber = index + 1;
              const issue = issuesByLine[lineNumber];
              const hasIssue = !!issue;

              let rowBgClass = '';
              let lineNumClass = 'text-on-surface-variant/40';
              if (hasIssue) {
                if (issue.severity === 'CRITICAL' || issue.severity === 'HIGH') {
                  rowBgClass = 'bg-error/10 border-l-2 border-error';
                  lineNumClass = 'text-error font-bold';
                } else {
                  rowBgClass = 'bg-amber-500/10 border-l-2 border-amber-500';
                  lineNumClass = 'text-amber-500 font-bold';
                }
              }

              return (
                <React.Fragment key={lineNumber}>
                  <tr className={`hover:bg-surface-variant/20 transition-colors ${rowBgClass}`}>
                    <td className={`w-12 text-right pr-4 select-none border-r border-outline-variant/20 ${lineNumClass}`}>
                      {lineNumber}
                    </td>
                    <td className="pl-4 whitespace-pre text-on-surface">
                      {line}
                    </td>
                  </tr>
                  {hasIssue && (
                    <tr className={rowBgClass}>
                      <td></td>
                      <td className="pl-4 py-2">
                        <div className={`p-3 rounded-lg border flex items-start gap-2 my-1 ${
                          issue.severity === 'CRITICAL' || issue.severity === 'HIGH'
                            ? 'bg-error/20 border-error/30 text-error'
                            : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        }`}>
                          <span className="material-symbols-outlined text-sm mt-0.5">
                            {issue.severity === 'CRITICAL' || issue.severity === 'HIGH' ? 'error' : 'warning'}
                          </span>
                          <div className="flex flex-col">
                            <span className="font-sans font-bold text-xs uppercase tracking-wider">
                              {issue.severity} ISSUE
                            </span>
                            <span className="font-sans text-xs text-on-surface mt-0.5">
                              {issue.message}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
