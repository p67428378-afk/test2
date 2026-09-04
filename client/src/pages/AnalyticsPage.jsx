import React, { useEffect, useState } from "react";
import { getSubjects, getStudyLogs, deleteStudyLog } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  BarChart2,
  Clock,
  CheckCircle2,
  FileText,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const AnalyticsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");
      const [subsData, logsData] = await Promise.all([
        getSubjects().catch(() => []),
        getStudyLogs().catch(() => []),
      ]);

      setSubjects(Array.isArray(subsData) ? subsData : []);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Delete this study log entry?")) return;
    try {
      await deleteStudyLog(logId);
      fetchAnalyticsData();
    } catch (err) {
      console.error("Error deleting study log:", err);
      setError("Failed to delete study log.");
    }
  };

  // Prepare chart data
  const chartData = subjects.map((s) => ({
    name: s.title,
    progress: Math.round(s.progress_percentage || 0),
    completedTopics: s.completed_topics || 0,
    totalTopics: s.total_topics || 0,
  }));

  const totalMinutesLogged = logs.reduce(
    (acc, l) => acc + (l.session_minutes || 0),
    0,
  );
  const totalHoursLogged = (totalMinutesLogged / 60).toFixed(1);
  const avgSessionMinutes =
    logs.length > 0 ? Math.round(totalMinutesLogged / logs.length) : 0;

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-medium text-slate-700">
          Loading Analytics & Performance Charts...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950 flex items-center gap-2">
          <BarChart2 className="h-7 w-7 text-indigo-600" />
          <span>Progress & Session Analytics</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review subject completion percentages, study session history, and
          learning trends.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Total Study Hours
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {totalHoursLogged} hrs
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Total Sessions Logged
            </p>
            <p className="text-2xl font-bold text-slate-900">{logs.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Avg. Session Duration
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {avgSessionMinutes} mins
            </p>
          </div>
        </div>
      </div>

      {/* Subject Progress Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Subject Completion Percentage (%)
        </h2>
        {chartData.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No subjects data available for analytics chart.
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Completion"]}
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "8px",
                    color: "#FFF",
                  }}
                />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.progress >= 80 ? "#059669" : "#3525CD"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Historical Study Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Study Session Log History
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No study sessions logged yet. Log your first study session from the
            Dashboard!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Topic ID</th>
                  <th className="py-3 px-4">Session Duration</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {log.logged_at
                        ? new Date(log.logged_at).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Recently"}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">
                      {log.topic_id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                        <Clock className="h-3 w-3" />
                        <span>{log.session_minutes} mins</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                      {log.notes || "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Delete Log"
                        aria-label="Delete Log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
