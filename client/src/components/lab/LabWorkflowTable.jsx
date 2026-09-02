import React, { useState } from "react";
import {
  FlaskConical,
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
  Trash2,
  Edit3,
} from "lucide-react";

export default function LabWorkflowTable({
  analyses = [],
  loading,
  onUpdateStatus,
  onDeleteAnalysis,
}) {
  const [editingId, setEditingId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("Pending");
  const [resultSummary, setResultSummary] = useState("");
  const [completionDate, setCompletionDate] = useState("");

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        Loading lab analysis requests...
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        No laboratory analysis requests found.
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Completed
          </span>
        );
      case "In-Progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <PlayCircle className="w-3.5 h-3.5 mr-1" />
            In-Progress
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Pending
          </span>
        );
    }
  };

  const handleStartEdit = (analysis) => {
    setEditingId(analysis.id);
    setUpdateStatus(analysis.status || "Pending");
    setResultSummary(analysis.result_summary || "");
    setCompletionDate(
      analysis.completion_date || new Date().toISOString().split("T")[0],
    );
  };

  const handleSaveEdit = async (analysisId) => {
    if (onUpdateStatus) {
      await onUpdateStatus(analysisId, {
        status: updateStatus,
        result_summary: resultSummary.trim() || null,
        completion_date:
          updateStatus === "Completed"
            ? completionDate || new Date().toISOString().split("T")[0]
            : null,
      });
    }
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Test Type & Lab Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Request / Completion Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Result Findings
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white text-sm">
            {analyses.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr
                  key={item.id}
                  className="hover:bg-stone-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-stone-900">
                      {item.test_type}
                    </div>
                    <div className="text-xs text-stone-500 font-medium">
                      {item.lab_name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isEditing ? (
                      <select
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        className="px-2 py-1 border border-stone-300 rounded text-xs bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      getStatusBadge(item.status)
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-stone-700 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>Req: {item.request_date}</span>
                    </div>
                    {item.completion_date && (
                      <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
                        Done: {item.completion_date}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-stone-700 max-w-xs">
                    {isEditing ? (
                      <textarea
                        value={resultSummary}
                        onChange={(e) => setResultSummary(e.target.value)}
                        placeholder="Enter analysis findings..."
                        rows="2"
                        className="w-full px-2 py-1 border border-stone-300 rounded text-xs"
                      />
                    ) : (
                      item.result_summary || (
                        <span className="text-stone-400 italic">
                          No results recorded yet
                        </span>
                      )
                    )}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                    {isEditing ? (
                      <div className="inline-flex space-x-1">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-2 py-1 bg-emerald-700 text-white rounded text-xs font-medium hover:bg-emerald-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-stone-200 text-stone-700 rounded text-xs font-medium hover:bg-stone-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(item)}
                          title="Update Status/Result"
                          className="p-1 text-stone-600 hover:text-amber-800 rounded transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {onDeleteAnalysis && (
                          <button
                            onClick={() => onDeleteAnalysis(item.id)}
                            title="Delete Request"
                            className="p-1 text-stone-400 hover:text-red-600 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
