import React, { useState } from "react";
import { Users, PlusCircle, AlertCircle, UserPlus } from "lucide-react";
import { assignMemberToTeam } from "../../services/api";

export default function TeamForm({ sites = [], onTeamCreated, onMemberAdded }) {
  const [teamName, setTeamName] = useState("");
  const [siteId, setSiteId] = useState("");

  // Member form state
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Archaeologist");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const roles = [
    "Director",
    "Archaeologist",
    "Field Assistant",
    "Lab Specialist",
    "Surveyor",
  ];

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    setLoading(true);
    try {
      await onTeamCreated({
        team_name: teamName.trim(),
        site_id: siteId || null,
      });
      setSuccess(`Team "${teamName}" created successfully!`);
      setTeamName("");
      setSiteId("");
    } catch (err) {
      console.error("Failed to create team:", err);
      setError("Failed to create team. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedTeamId) {
      setError("Please select a team to add member to.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName.trim(),
        role,
        email: email.trim(),
        phone: phone.trim() || null,
      };

      await assignMemberToTeam(selectedTeamId, payload);
      setSuccess(`Member "${fullName}" assigned to team!`);
      if (onMemberAdded) onMemberAdded();

      setFullName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Failed to assign member:", err);
      setError("Failed to assign member to team.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Team Form */}
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
          <Users className="w-5 h-5 text-amber-800" />
          <h3 className="text-lg font-bold text-stone-900">
            Create Excavation Team
          </h3>
        </div>

        {error && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm flex items-start space-x-2"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Team Name *
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Excavation Unit 1"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Assigned Excavation Site
            </label>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
            >
              <option value="">-- Optional: Assign to Site --</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.site_code})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-800 text-white rounded font-medium text-sm hover:bg-amber-900 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? "Creating..." : "Create Team"}</span>
          </button>
        </form>
      </div>

      {/* Add Member Form */}
      <div className="bg-white p-6 rounded-lg border border-stone-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-4 border-b border-stone-100 pb-3">
          <UserPlus className="w-5 h-5 text-amber-800" />
          <h3 className="text-lg font-bold text-stone-900">Add Team Member</h3>
        </div>

        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Select Team *
            </label>
            <select
              required
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
            >
              <option value="">-- Select Team --</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. John Smith"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 bg-white"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.smith@arch.edu"
                className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555-0192"
              className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-stone-800 text-white rounded font-medium text-sm hover:bg-stone-900 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Assigning..." : "Assign Member"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
