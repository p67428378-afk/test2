import React, { useState, useEffect } from "react";
import { conferenceApi, sessionApi, registrationApi } from "../services/api";
import StatCard from "../components/common/StatCard";
import DataTable from "../components/common/DataTable";
import { Calendar, Plus, MapPin, AlertCircle, CheckCircle } from "lucide-react";

export default function OrganizerDashboardPage() {
  const [conferences, setConferences] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const confData = await conferenceApi.listConferences();
      setConferences(confData || []);
      const sessData = await sessionApi.listSessions();
      setSessions(sessData || []);
      const regData = await registrationApi.listRegistrations();
      setRegistrations(regData || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to fetch conference data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateConference = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const created = await conferenceApi.createConference({
        title: newTitle,
        description: newDesc,
        location: newLoc,
        start_date: startDate || new Date().toISOString().split("T")[0],
        end_date: endDate || new Date().toISOString().split("T")[0],
        status: "DRAFT",
      });
      setSuccessMsg(`Conference "${created.title}" created successfully!`);
      setShowModal(false);
      // Reset form
      setNewTitle("");
      setNewDesc("");
      setNewLoc("");
      setStartDate("");
      setEndDate("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create conference.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Conference Title",
      accessor: "title",
      render: (row) => (
        <div>
          <span className="font-semibold text-[#171c29] block">
            {row.title}
          </span>
          <span className="text-xs text-[#707a8c] line-clamp-1">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      render: (row) => (
        <span className="flex items-center gap-1 text-[#707a8c]">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {row.location}
        </span>
      ),
    },
    {
      header: "Dates",
      accessor: "start_date",
      render: (row) => (
        <span className="text-xs text-[#707a8c] font-mono">
          {row.start_date} to {row.end_date}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const isPublished = row.status === "PUBLISHED";
        return (
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              isPublished
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#171c29]">
            Organizer Conference Management
          </h1>
          <p className="text-sm text-[#707a8c]">
            Create, monitor, and publish event schedules
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2663eb] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Conference</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Total Conferences"
          value={conferences.length}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          label="Sessions Submitted"
          value={sessions.length}
          icon={Calendar}
          color="amber"
        />
        <StatCard
          label="Total Registrations"
          value={registrations.length}
          icon={Calendar}
          color="green"
        />
      </div>

      {/* Conference Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#171c29]">All Conferences</h2>
        <DataTable
          columns={columns}
          data={conferences}
          loading={loading}
          emptyMessage="No conferences created yet."
        />
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-[#e3e8f0]">
            <div className="flex items-center justify-between border-b pb-3 border-[#e3e8f0]">
              <h3 className="text-lg font-bold text-[#171c29]">
                Create New Conference
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateConference} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  placeholder="e.g. Global Tech Summit 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                  Description
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  rows="3"
                  placeholder="Brief summary of the conference theme and goals..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  placeholder="e.g. Convention Center, San Francisco"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e3e8f0]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#2663eb] text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Conference"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
