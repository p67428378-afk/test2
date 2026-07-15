import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Shield,
  RefreshCw,
  Key,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import VaultTable from "../components/vault/VaultTable";
import PasswordGenerator from "../components/vault/PasswordGenerator";
import { passwordService, authService } from "../services/api";

export default function DashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState("vault");
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const userEmail = authService.getUserEmail();

  const fetchEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await passwordService.getAll();
      setEntries(data);
    } catch (err) {
      setError("Failed to load password entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "vault") {
      fetchEntries();
    }
  }, [activeTab]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({ title: "", username: "", password: "", url: "" });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry) => {
    setModalMode("edit");
    setSelectedEntryId(entry.id);
    setFormData({
      title: entry.title,
      username: entry.username,
      password: entry.password,
      url: entry.url || "",
    });
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateInModal = async () => {
    try {
      const result = await passwordService.generate({ length: 16 });
      setFormData((prev) => ({ ...prev, password: result.password }));
    } catch (err) {
      setModalError("Failed to generate password.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.username || !formData.password) {
      setModalError("Title, Username, and Password are required.");
      return;
    }

    setModalLoading(true);
    setModalError("");
    try {
      if (modalMode === "create") {
        await passwordService.create(
          formData.title,
          formData.username,
          formData.password,
          formData.url,
        );
        setSuccessMessage("Password entry created successfully!");
      } else {
        await passwordService.update(selectedEntryId, formData);
        setSuccessMessage("Password entry updated successfully!");
      }
      setIsModalOpen(false);
      fetchEntries();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setModalError(
        err.response?.data?.detail || "An error occurred. Please try again.",
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this password entry?")
    ) {
      return;
    }

    try {
      await passwordService.delete(id);
      setSuccessMessage("Password entry deleted successfully!");
      fetchEntries();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete password entry.");
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.username.toLowerCase().includes(query) ||
      (entry.url && entry.url.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        userEmail={userEmail}
        onLogout={onLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "vault" ? (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  My Password Vault
                </h2>
                <p className="text-slate-400 text-sm">
                  Manage and access your secure credentials.
                </p>
              </div>
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-colors self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add Password
              </button>
            </div>

            {/* Alerts */}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by title, username, or website..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="text-sm text-slate-400 font-medium">
                Showing{" "}
                <span className="text-slate-200 font-bold">
                  {filteredEntries.length}
                </span>{" "}
                of{" "}
                <span className="text-slate-200 font-bold">
                  {entries.length}
                </span>{" "}
                entries
              </div>
            </div>

            {/* Table / Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 text-sm">
                  Loading your secure vault...
                </p>
              </div>
            ) : (
              <VaultTable
                entries={filteredEntries}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteEntry}
              />
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <PasswordGenerator />
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
              <h3 className="text-lg font-bold text-white">
                {modalMode === "create"
                  ? "Add Password Entry"
                  : "Edit Password Entry"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Google, Personal Email"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Website URL
                </label>
                <input
                  type="text"
                  name="url"
                  placeholder="e.g. google.com"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Username / Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="e.g. user@example.com"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="password"
                    required
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateInModal}
                    className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5 text-xs font-medium"
                    title="Generate Password"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Generate
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-colors"
                >
                  {modalLoading ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
