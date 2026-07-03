import React, { useState, useEffect } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Check,
} from "lucide-react";
import Badge from "../components/common/Badge.jsx";
import Table from "../components/common/Table.jsx";
import Button from "../components/common/Button.jsx";
import { serviceRequestService } from "../services/api.js";

export default function TechnicianDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [notes, setNotes] = useState({});

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await serviceRequestService.getRequests();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching service requests:", err);
      setError(
        "Failed to load service requests. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      const requestNotes = notes[requestId] || "";
      await serviceRequestService.updateRequest(
        requestId,
        newStatus,
        requestNotes,
      );
      // Refresh list
      const updated = await serviceRequestService.getRequests();
      setRequests(updated);
    } catch (err) {
      console.error("Error updating request status:", err);
      alert("Failed to update service request status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNotesChange = (requestId, val) => {
    setNotes((prev) => ({ ...prev, [requestId]: val }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="text-slate-500 text-sm font-medium">
          Loading service requests...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Technician Dashboard Error
        </h3>
        <p className="text-red-600 text-sm mb-6">{error}</p>
        <Button onClick={fetchRequests} variant="danger" className="mx-auto">
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Service Request Management
        </h1>
        <p className="text-sm text-slate-500">
          Manage and resolve assigned solar panel maintenance requests
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Assigned Tasks
            </h3>
            <p className="text-xs text-slate-500">
              List of maintenance requests requiring attention
            </p>
          </div>
          <Badge variant="info" className="px-3 py-1">
            {requests.length} Total Requests
          </Badge>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <p className="font-medium text-slate-700">
              No pending service requests
            </p>
            <p className="text-xs text-slate-400 mt-1">
              All assigned systems are fully operational.
            </p>
          </div>
        ) : (
          <Table
            headers={[
              "Customer / System",
              "Alert Details",
              "Date Created",
              "Status",
              "Notes",
              "Actions",
            ]}
          >
            {requests.map((req) => (
              <tr
                key={req.request_id}
                className="hover:bg-slate-50 transition-colors align-top"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">
                    {req.customer_name || "N/A"}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    {req.system_id}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-700 max-w-xs break-words">
                  {req.alert_details}
                </td>
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                  {new Date(req.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={
                      req.status === "New"
                        ? "info"
                        : req.status === "In Progress"
                          ? "warning"
                          : req.status === "Resolved"
                            ? "success"
                            : "neutral"
                    }
                  >
                    {req.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {req.status === "Resolved" || req.status === "Closed" ? (
                    <p className="text-xs text-slate-500 italic max-w-xs break-words">
                      {req.notes || "No notes provided."}
                    </p>
                  ) : (
                    <textarea
                      value={
                        notes[req.request_id] !== undefined
                          ? notes[req.request_id]
                          : req.notes || ""
                      }
                      onChange={(e) =>
                        handleNotesChange(req.request_id, e.target.value)
                      }
                      placeholder="Add resolution notes..."
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      rows={2}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {req.status === "New" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(req.request_id, "In Progress")
                        }
                        disabled={updatingId === req.request_id}
                        variant="primary"
                        className="px-3 py-1.5 text-xs"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start Work
                      </Button>
                    )}
                    {req.status === "In Progress" && (
                      <Button
                        onClick={() =>
                          handleStatusUpdate(req.request_id, "Resolved")
                        }
                        disabled={updatingId === req.request_id}
                        variant="success"
                        className="px-3 py-1.5 text-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Resolve
                      </Button>
                    )}
                    {(req.status === "Resolved" || req.status === "Closed") && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Completed
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}
