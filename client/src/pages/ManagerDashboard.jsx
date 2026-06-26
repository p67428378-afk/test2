import React, { useState, useEffect } from "react";
import { leaveService } from "../services/api";
import PendingRequestsTable from "../components/leave/PendingRequestsTable";
import RejectRequestPanel from "../components/leave/RejectRequestPanel";

export default function ManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeamRequests = async () => {
    try {
      const data = await leaveService.getTeamRequests("Pending");
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load team requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamRequests();
  }, []);

  const handleApprove = async (requestId) => {
    setError("");
    try {
      await leaveService.updateRequestStatus(requestId, "Approved");
      await fetchTeamRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to approve request.");
    }
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
  };

  const handleConfirmReject = async (requestId, comment) => {
    setError("");
    try {
      await leaveService.updateRequestStatus(requestId, "Rejected", comment);
      setSelectedRequest(null);
      await fetchTeamRequests();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to reject request.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-body-lg font-body-lg text-secondary">
          Loading team requests...
        </p>
      </div>
    );
  }

  return (
    <div className="p-margin-page flex-1 max-w-[1440px] mx-auto w-full">
      {error && (
        <div
          className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-body-md font-body-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-8">
          <PendingRequestsTable
            requests={requests}
            onApprove={handleApprove}
            onRejectClick={handleRejectClick}
          />
        </div>
        {selectedRequest && (
          <div className="lg:col-span-4">
            <RejectRequestPanel
              request={selectedRequest}
              onConfirm={handleConfirmReject}
              onCancel={() => setSelectedRequest(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
