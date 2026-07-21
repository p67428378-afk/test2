import React, { useState, useEffect } from "react";
import { crewService, expeditionService } from "../../services/api.js";

export default function CrewList({ expeditionId }) {
  const [assignedCrew, setAssignedCrew] = useState([]);
  const [allCrew, setAllCrew] = useState([]);
  const [selectedCrewId, setSelectedCrewId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (expeditionId) {
      fetchExpeditionCrew();
      fetchAllCrew();
    }
  }, [expeditionId]);

  const fetchExpeditionCrew = async () => {
    try {
      setLoading(true);
      const data = await expeditionService.getExpeditionCrew(expeditionId);
      setAssignedCrew(data);
    } catch (err) {
      console.error("Error fetching expedition crew:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCrew = async () => {
    try {
      const data = await crewService.getCrew();
      setAllCrew(data);
    } catch (err) {
      console.error("Error fetching all crew:", err);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedCrewId || !role) {
      setError("Please select a crew member and specify their role.");
      return;
    }

    try {
      setError("");
      await expeditionService.assignCrew(expeditionId, {
        crew_id: selectedCrewId,
        role,
      });
      setSelectedCrewId("");
      setRole("");
      fetchExpeditionCrew();
    } catch (err) {
      console.error("Error assigning crew:", err);
      setError("Failed to assign crew member. They might already be assigned.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-lg p-6">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">group</span>
          Assigned Crew
        </h3>

        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading crew...</p>
        ) : assignedCrew.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">
            No crew members assigned to this expedition yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-on-surface-variant/70 border-b border-white/10">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Certification</th>
                </tr>
              </thead>
              <tbody>
                {assignedCrew.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-2 font-medium text-on-surface">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="py-2 text-secondary">{member.role}</td>
                    <td className="py-2 text-on-surface-variant">
                      {member.certification}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form
        onSubmit={handleAssign}
        className="bg-surface-container p-6 rounded-lg border border-white/10 space-y-4"
      >
        <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">
          Assign Crew Member
        </h4>

        {error && (
          <div className="bg-error-container/20 border border-error text-error p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Crew Member *
            </label>
            <select
              value={selectedCrewId}
              onChange={(e) => setSelectedCrewId(e.target.value)}
              className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              required
            >
              <option value="">Select a crew member...</option>
              {allCrew
                .filter((c) => !assignedCrew.some((ac) => ac.id === c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} ({c.certification})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Role *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Chief Scientist, Marine Engineer"
              className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-on-primary font-bold rounded hover:bg-primary-container text-sm transition-colors"
          >
            Assign Crew
          </button>
        </div>
      </form>
    </div>
  );
}
