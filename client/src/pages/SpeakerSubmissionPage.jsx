import React, { useState, useEffect } from "react";
import { conferenceApi, sessionApi } from "../services/api";
import DataTable from "../components/common/DataTable";
import { Send, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function SpeakerSubmissionPage() {
  const [conferences, setConferences] = useState([]);
  const [selectedConf, setSelectedConf] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [track, setTrack] = useState("AI / Machine Learning");

  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const confs = await conferenceApi.listConferences();
        setConferences(confs || []);
        if (confs && confs.length > 0) {
          setSelectedConf(confs[0].id);
        }
        const sess = await sessionApi.listSessions();
        setMySessions(sess || []);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Failed to load speaker portal data.",
        );
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedConf) {
      setError("Please select a conference.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await sessionApi.createSession({
        conference_id: selectedConf,
        title,
        abstract,
        track,
      });

      setSuccess(`Session proposal "${created.title}" submitted successfully!`);
      setTitle("");
      setAbstract("");

      // Refresh sessions
      const updatedSess = await sessionApi.listSessions();
      setMySessions(updatedSess || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Submission failed. Make sure you are signed in as a Speaker.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <span className="font-semibold text-[#171c29]">{row.title}</span>
      ),
    },
    {
      header: "Track",
      accessor: "track",
      render: (row) => (
        <span className="px-2 py-0.5 text-xs font-mono bg-blue-50 text-blue-700 rounded border border-blue-100">
          {row.track}
        </span>
      ),
    },
    {
      header: "Abstract",
      accessor: "abstract",
      render: (row) => (
        <p className="text-xs text-[#707a8c] line-clamp-1 max-w-md">
          {row.abstract}
        </p>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const statusColors = {
          SUBMITTED: "bg-yellow-100 text-yellow-800",
          UNDER_REVIEW: "bg-blue-100 text-blue-800",
          APPROVED: "bg-green-100 text-green-800",
          REJECTED: "bg-red-100 text-red-800",
          SCHEDULED: "bg-purple-100 text-purple-800",
        };
        return (
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[row.status] || "bg-gray-100 text-gray-800"}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Speaker Proposal Submission
        </h1>
        <p className="text-sm text-[#707a8c]">
          Submit session abstracts to upcoming conferences for review
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Submission Form */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2663eb]" />
          <span>Submit New Abstract</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
              Target Conference *
            </label>
            <select
              value={selectedConf}
              onChange={(e) => setSelectedConf(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            >
              <option value="">-- Select a Conference --</option>
              {conferences.map((conf) => (
                <option key={conf.id} value={conf.id}>
                  {conf.title} ({conf.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
              placeholder="e.g. Building Resilient Cloud Systems with React & FastAPI"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
              Track *
            </label>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
            >
              <option value="AI / Machine Learning">
                AI / Machine Learning
              </option>
              <option value="Cloud Architecture">Cloud Architecture</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Security & Compliance">
                Security & Compliance
              </option>
              <option value="DevOps & Reliability">DevOps & Reliability</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#171c29] uppercase mb-1">
              Abstract Summary *
            </label>
            <textarea
              required
              rows="4"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full px-3 py-2 border border-[#e3e8f0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
              placeholder="Describe your session key takeaways, target audience, and main findings..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2663eb] text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Submitting..." : "Submit Proposal"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Sessions Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#171c29]">
          Submitted Proposals
        </h2>
        <DataTable
          columns={columns}
          data={mySessions}
          loading={loading}
          emptyMessage="No session proposals submitted yet."
        />
      </div>
    </div>
  );
}
