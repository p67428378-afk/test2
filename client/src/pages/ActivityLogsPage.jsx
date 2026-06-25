import React, { useState, useEffect } from "react";
import AuditTrailTable from "../components/logs/AuditTrailTable";
import { getActivityLogs } from "../services/api";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        skip,
        limit,
      };
      if (type) params.type = type;
      if (status) params.status = status;

      const data = await getActivityLogs(params);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [skip, type, status]);

  const handlePageChange = (newSkip) => {
    setSkip(newSkip);
  };

  return (
    <div className="space-y-grid-margin">
      <div>
        <h1 className="text-headline-md font-bold text-on-surface">
          Activity Logs
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Immutable audit trail of all sweeps, conversions, and hedging
          activities
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-surface-container-low border border-outline-variant p-4 rounded-lg">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setSkip(0);
            }}
            className="bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="SWEEP">SWEEP</option>
            <option value="FX_CONVERSION">FX_CONVERSION</option>
            <option value="HEDGE">HEDGE</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setSkip(0);
            }}
            className="bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      <AuditTrailTable
        logs={logs}
        total={total}
        skip={skip}
        limit={limit}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}
