import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Star,
  KeyRound,
  ShieldAlert,
  Settings,
  User,
  Plus,
  Filter,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Check,
  Copy,
} from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import CredentialsTable from "../components/vault/CredentialsTable";
import PasswordGeneratorWidget from "../components/vault/PasswordGeneratorWidget";
import { credentialsService, passwordService } from "../services/api";

export default function DashboardPage({ onLogout, user }) {
  const [activeTab, setActiveTab] = useState("all");
  const [credentials, setCredentials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [isAddModalOpen, setIsOpenAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCredentialId, setSelectedCredentialId] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [showFormPassword, setShowFormPassword] = useState(false);

  const fetchCredentials = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await credentialsService.getAll(searchQuery);
      setCredentials(data);
    } catch (err) {
      console.error("Failed to fetch credentials", err);
      setError("Failed to load credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, [searchQuery]);

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedCredentialId(null);
    setFormTitle("");
    setFormUsername("");
    setFormPassword("");
    setFormUrl("");
    setFormNotes("");
    setIsOpenAddModal(true);
  };

  const handleOpenEditModal = (cred) => {
    setIsEditMode(true);
    setSelectedCredentialId(cred.id);
    setFormTitle(cred.title);
    setFormUsername(cred.username);
    setFormPassword(cred.password);
    setFormUrl(cred.url || "");
    setFormNotes(cred.notes || "");
    setIsOpenAddModal(true);
  };

  const handleDeleteCredential = async (id) => {
    if (window.confirm("Are you sure you want to delete this credential?")) {
      try {
        await credentialsService.delete(id);
        fetchCredentials();
      } catch (err) {
        console.error("Failed to delete credential", err);
        alert("Failed to delete credential.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formUsername || !formPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      title: formTitle,
      username: formUsername,
      password: formPassword,
      url: formUrl || null,
      notes: formNotes || null,
    };

    try {
      if (isEditMode) {
        await credentialsService.update(selectedCredentialId, payload);
      } else {
        await credentialsService.create(payload);
      }
      setIsOpenAddModal(false);
      fetchCredentials();
    } catch (err) {
      console.error("Failed to save credential", err);
      alert("Failed to save credential. Please check your inputs.");
    }
  };

  const handleGeneratePasswordForForm = async () => {
    try {
      const data = await passwordService.generate({ length: 16 });
      setFormPassword(data.password);
    } catch (err) {
      console.error("Failed to generate password", err);
      // Fallback local generator
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let result = "";
      for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setFormPassword(result);
    }
  };

  // Stats calculations
  const totalPasswords = credentials.length;
  const weakPasswords = credentials.filter(
    (c) => c.password.length < 10,
  ).length;
  const reusedPasswords = credentials.filter(
    (c, index, self) =>
      self.findIndex((t) => t.password === c.password) !== index,
  ).length;

  return (
    <div className="h-screen flex overflow-hidden bg-[#0F172A] text-[#dae2fd]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        user={user}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-[280px] w-full relative">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddModal={handleOpenAddModal}
          onLogout={onLogout}
          user={user}
        />

        {/* Main Canvas */}
        <main className="flex-1 mt-[64px] p-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
            {/* Page Header */}
            <div>
              <h2 className="text-3xl font-bold text-[#dae2fd] mb-1 capitalize">
                {activeTab === "all" ? "All Items" : activeTab}
              </h2>
              <p className="text-sm text-[#bbcabf]">
                Manage and secure your digital identity.
              </p>
            </div>

            {/* Row 1: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="bg-[#1E293B] border border-[#3c4a42] rounded-lg p-4 relative overflow-hidden group hover:bg-[#2D3748] transition-colors">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs text-[#bbcabf] uppercase tracking-wider mb-1">
                      Total Passwords
                    </p>
                    <p className="text-3xl font-bold text-[#dae2fd]">
                      {totalPasswords}
                    </p>
                  </div>
                  <div className="bg-[#10b981]/10 p-2 rounded-lg text-[#4edea3]">
                    <Lock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-[#1E293B] border border-[#3c4a42] rounded-lg p-4 relative overflow-hidden group hover:bg-[#2D3748] transition-colors">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs text-[#bbcabf] uppercase tracking-wider mb-1">
                      Weak Passwords
                    </p>
                    <p className="text-3xl font-bold text-[#ffb95f]">
                      {weakPasswords}
                    </p>
                  </div>
                  <div className="bg-[#ffb95f]/10 p-2 rounded-lg text-[#ffb95f]">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-[#1E293B] border border-[#3c4a42] rounded-lg p-4 relative overflow-hidden group hover:bg-[#2D3748] transition-colors">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs text-[#bbcabf] uppercase tracking-wider mb-1">
                      Reused Passwords
                    </p>
                    <p className="text-3xl font-bold text-[#4edea3]">
                      {reusedPasswords}
                    </p>
                  </div>
                  <div className="bg-[#10b981]/10 p-2 rounded-lg text-[#4edea3]">
                    <Check className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Credentials Table */}
              <div className="lg:col-span-8 bg-[#1E293B] border border-[#3c4a42] rounded-lg overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-[#3c4a42] flex justify-between items-center bg-[#1E293B]/50">
                  <h3 className="text-lg font-semibold text-[#dae2fd]">
                    Stored Credentials
                  </h3>
                  <button className="text-[#bbcabf] hover:text-[#4edea3] transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="p-8 text-center text-[#bbcabf] flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Loading credentials...
                  </div>
                ) : error ? (
                  <div className="p-8 text-center text-[#ffb4ab]">{error}</div>
                ) : (
                  <CredentialsTable
                    credentials={credentials}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteCredential}
                  />
                )}
              </div>

              {/* Right: Generator Widget */}
              <div className="lg:col-span-4">
                <PasswordGeneratorWidget />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Credential Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#3c4a42] rounded-lg w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#3c4a42] flex justify-between items-center bg-[#131b2e]">
              <h3 className="text-lg font-semibold text-[#dae2fd]">
                {isEditMode ? "Edit Credential" : "Add New Credential"}
              </h3>
              <button
                onClick={() => setIsOpenAddModal(false)}
                className="text-[#bbcabf] hover:text-[#dae2fd]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-4 flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
                  placeholder="e.g. Google, GitHub"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
                  Username / Email *
                </label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
                  placeholder="e.g. alex@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showFormPassword ? "text" : "password"}
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full bg-[#0b1326] border border-[#3c4a42] rounded pl-3 pr-20 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
                    placeholder="Enter password"
                  />
                  <div className="absolute right-2 top-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowFormPassword(!showFormPassword)}
                      className="text-[#bbcabf] hover:text-[#dae2fd] p-1"
                    >
                      {showFormPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleGeneratePasswordForForm}
                      className="text-[#4edea3] hover:text-[#10b981] p-1"
                      title="Generate Password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
                  URL (Optional)
                </label>
                <input
                  type="text"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
                  placeholder="e.g. https://github.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bbcabf] uppercase mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3c4a42] rounded px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3] h-20 resize-none"
                  placeholder="Add any extra details..."
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenAddModal(false)}
                  className="flex-1 bg-transparent border border-[#3c4a42] hover:border-[#dae2fd] text-[#dae2fd] py-2 rounded font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#10b981] text-[#002113] hover:opacity-90 py-2 rounded font-semibold text-sm transition-all"
                >
                  {isEditMode ? "Save Changes" : "Add Secret"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
