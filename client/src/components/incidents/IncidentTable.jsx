import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  User,
  FileText,
  Edit3,
} from "lucide-react";

export default function IncidentTable({ incidents, users, onUpdateIncident }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editAssignee, setEditAssignee] = useState("");

  const startUpdate = (incident) => {
    setUpdatingId(incident.id);
    setEditNotes(incident.internal_notes || "");
    setEditStatus(incident.status);
    setEditAssignee(incident.assignee_id || "");
  };

  const cancelUpdate = () => {
    setUpdatingId(null);
  };

  const handleSave = async (id) => {
    await onUpdateIncident(id, {
      status: editStatus,
      assignee_id: editAssignee || null,
      internal_notes: editNotes,
    });
    setUpdatingId(null);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            High
          </span>
        );
      case "Medium":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-3 w-3" /> Resolved
          </span>
        );
      case "Closed":
        return (
          <span className="flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <CheckCircle className="h-3 w-3" /> Closed
          </span>
        );
      case "In Progress":
        return (
          <span className="flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Clock className="h-3 w-3" /> In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="h-3 w-3" /> Open
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">All Reported Incidents</h3>
        <span className="text-xs text-slate-500 font-medium">
          {incidents.length} total incidents tracked
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-600 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-3.5">Incident Details</th>
              <th className="px-6 py-3.5">Priority</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Assignee</th>
              <th className="px-6 py-3.5">SLA Status</th>
              <th className="px-6 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {incidents.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  No incidents reported yet. Use the "Report Incident" form to
                  submit one.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => {
                const isEditing = updatingId === incident.id;
                const assignee = users.find(
                  (u) => u.id === incident.assignee_id,
                );

                // Calculate SLA breach
                const elapsedMinutes =
                  (new Date() - new Date(incident.created_at)) / 60000;
                const slaLimit =
                  incident.priority === "High"
                    ? 60
                    : incident.priority === "Medium"
                      ? 120
                      : 240;
                const isBreached =
                  (incident.status === "Open" ||
                    incident.status === "In Progress") &&
                  elapsedMinutes > slaLimit;

                return (
                  <tr
                    key={incident.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-semibold text-slate-900 mb-1">
                        {incident.title}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                        {incident.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>
                          System:{" "}
                          <strong className="text-slate-600">
                            {incident.affected_system}
                          </strong>
                        </span>
                        <span>
                          Reported by:{" "}
                          <strong className="text-slate-600">
                            {incident.reporter_name}
                          </strong>
                        </span>
                        <span>
                          Date:{" "}
                          <strong className="text-slate-600">
                            {new Date(incident.created_at).toLocaleString()}
                          </strong>
                        </span>
                      </div>
                      {incident.internal_notes && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-100 rounded text-xs text-slate-600 font-mono whitespace-pre-wrap">
                          {incident.internal_notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(incident.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-xs bg-white"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      ) : (
                        getStatusBadge(incident.status)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <select
                          value={editAssignee}
                          onChange={(e) => setEditAssignee(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-xs bg-white max-w-[150px]"
                        >
                          <option value="">Unassigned</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name} ({u.role})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">
                            {assignee ? assignee.name : "Unassigned"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isBreached ? (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                          SLA BREACHED
                        </span>
                      ) : incident.status === "Resolved" ||
                        incident.status === "Closed" ? (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          SLA MET
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Within SLA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium">
                      {isEditing ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add internal notes..."
                            className="p-1.5 border border-slate-300 rounded text-xs w-48 h-16"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(incident.id)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelUpdate}
                              className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => startUpdate(incident)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" /> Update
                          </button>
                          {(incident.status === "Resolved" ||
                            incident.status === "Closed") && (
                            <Link
                              to={`/rca/${incident.id}`}
                              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5" /> RCA Report
                            </Link>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
