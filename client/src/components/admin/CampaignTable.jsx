import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Target,
  AlertCircle,
} from "lucide-react";
import { campaignsAPI } from "../../services/api";

export default function CampaignTable({ campaigns, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target_amount: "",
    category: "Medical",
    status: "Active",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      title: "",
      description: "",
      target_amount: "5000",
      category: "Medical",
      status: "Active",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split("T")[0],
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title || "",
      description: campaign.description || "",
      target_amount: campaign.target_amount
        ? String(campaign.target_amount)
        : "",
      category: campaign.category || "Medical",
      status: campaign.status || "Active",
      start_date: campaign.start_date ? campaign.start_date.split("T")[0] : "",
      end_date: campaign.end_date ? campaign.end_date.split("T")[0] : "",
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Date validation
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setErrorMsg("End date must be after start date.");
      return;
    }

    if (parseFloat(formData.target_amount) <= 0) {
      setErrorMsg("Target amount must be greater than zero.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        target_amount: parseFloat(formData.target_amount),
        category: formData.category,
        status: formData.status,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      if (editingCampaign) {
        await campaignsAPI.updateCampaign(editingCampaign.id, payload);
      } else {
        await campaignsAPI.createCampaign(payload);
      }

      setShowModal(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to save campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete/archive this campaign?")
    )
      return;
    try {
      await campaignsAPI.deleteCampaign(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete campaign.");
    }
  };

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Campaign Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, pause, and track active fundraising campaigns
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Title & Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Raised / Target</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">End Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-400 text-sm"
                >
                  No campaigns created yet. Click "Create Campaign" to add one.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => {
                const current = Number(c.current_amount || 0);
                const target = Number(c.target_amount || 1);
                const percent = Math.min(
                  100,
                  Math.round((current / target) * 100),
                );

                return (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {c.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 text-xs">
                        {formatCurrency(current)} / {formatCurrency(target)}
                      </div>
                      <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          c.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : c.status === "Paused"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : c.status === "Completed"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                      {c.end_date
                        ? new Date(c.end_date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-600 hover:text-red-800 p-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Fill out campaign attributes and fundraising target.
            </p>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Clean Water Drive 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the cause and goals..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Goal ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={formData.target_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        target_amount: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Medical">Medical</option>
                    <option value="Education">Education</option>
                    <option value="Environment">Environment</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingCampaign
                      ? "Update Campaign"
                      : "Create Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
