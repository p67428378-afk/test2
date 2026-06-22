import React, { useState, useEffect } from "react";
import KPIStats from "../components/dashboard/KPIStats";
import AttachmentsTable from "../components/dashboard/AttachmentsTable";
import { getStats, getAttachments, deleteAttachment } from "../services/api";

export default function DashboardPage({ refreshTrigger, onRefreshStats }) {
  const [stats, setStats] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);

      const attachmentsData = await getAttachments();
      setAttachments(attachmentsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshTrigger]);

  const handleDeleteAttachment = async (id) => {
    if (window.confirm("Are you sure you want to delete this attachment?")) {
      try {
        await deleteAttachment(id);
        fetchDashboardData();
        if (onRefreshStats) onRefreshStats();
      } catch (error) {
        console.error("Error deleting attachment:", error);
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-background">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-headline-lg text-on-surface font-bold mb-2">
            NoteFlow Dashboard
          </h1>
          <p className="text-outline font-body-md">
            Overview of your workspace metrics and files
          </p>
        </div>

        <KPIStats stats={stats} />

        <AttachmentsTable
          attachments={attachments}
          onDeleteAttachment={handleDeleteAttachment}
        />
      </div>
    </div>
  );
}
