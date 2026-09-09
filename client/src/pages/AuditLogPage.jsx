import React, { useState, useEffect } from "react";
import AuditLogTable from "../components/audit/AuditLogTable";
import { auditAPI } from "../services/api";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async (params = {}) => {
    try {
      const res = await auditAPI.listLogs(params);
      setLogs(res.items || res || []);
      setTotal(res.total || (res.items ? res.items.length : 0));
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    }
  };

  const handleFilterChange = (filters) => {
    fetchLogs(filters);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          5. Comprehensive Tamper-Evident Audit Logging
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically immutable stream capturing logins, evidence uploads,
          access attempts, 403 authorization denials, and custody transfers.
        </p>
      </div>

      <AuditLogTable
        logs={logs}
        total={total}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
