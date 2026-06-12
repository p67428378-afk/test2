import React, { useState, useEffect } from 'react';
import ReportsQueueTable from '../components/reports/ReportsQueueTable';
import XMLPreviewPanel from '../components/reports/XMLPreviewPanel';
import { getReports, submitReport } from '../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePreview = (report) => {
    setSelectedReport(report);
  };

  const handleSubmitReport = async (id) => {
    try {
      setIsSubmitting(true);
      await submitReport(id);
      await fetchReports();
      if (selectedReport && selectedReport.id === id) {
        setSelectedReport((prev) => ({ ...prev, status: 'SUBMITTED' }));
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-lg text-display-lg text-on-surface">Regulatory Reports</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Manage and file auto-generated STR and CTR reports to the FIU-IND portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-center py-12 text-on-surface-variant">Loading reports...</div>
          ) : (
            <ReportsQueueTable
              reports={reports}
              onPreview={handlePreview}
              onSubmit={handleSubmitReport}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <div>
          {selectedReport ? (
            <XMLPreviewPanel
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
            />
          ) : (
            <div className="bg-surface-container rounded-lg border border-outline-variant p-6 text-center text-on-surface-variant">
              Select a report from the queue to preview its FIU-IND compliant XML content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}