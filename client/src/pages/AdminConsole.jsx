import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import WasteAnalyticsChart from "../components/admin/WasteAnalyticsChart";
import AuditLogsTable from "../components/admin/AuditLogsTable";
import { adminApi } from "../services/api";

export default function AdminConsole({ currentUser }) {
  const [analytics, setAnalytics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, logsData] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getAuditLogs(),
      ]);
      setAnalytics(analyticsData);
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar userRole={currentUser?.role || "admin"} />
      <main className="flex-1 flex flex-col">
        <Header
          title="Admin Oversight & Audit Console"
          subtitle="Real-time operational waste analytics and system-wide audit logs"
          onRefresh={fetchData}
        />

        <div className="p-6 space-y-6 max-w-7xl">
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              Loading analytics and logs...
            </div>
          ) : (
            <>
              <WasteAnalyticsChart analytics={analytics} />
              <AuditLogsTable logs={logs} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
