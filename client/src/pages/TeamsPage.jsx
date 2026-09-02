import React, { useState, useEffect } from "react";
import { Users, RefreshCw } from "lucide-react";
import TeamForm from "../components/teams/TeamForm";
import TeamTable from "../components/teams/TeamTable";
import { getTeams, createTeam, deleteTeam, getSites } from "../services/api";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSitesList = async () => {
    try {
      const data = await getSites({ limit: 100 });
      setSites(data.items || []);
    } catch (err) {
      console.error("Error fetching sites for team assignments:", err);
    }
  };

  const fetchTeamsList = async () => {
    setLoading(true);
    try {
      const data = await getTeams();
      setTeams(data.items || []);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitesList();
    fetchTeamsList();
  }, []);

  const handleCreateTeam = async (teamPayload) => {
    await createTeam(teamPayload);
    await fetchTeamsList();
  };

  const handleDeleteTeam = async (teamId) => {
    if (
      window.confirm("Are you sure you want to delete this excavation team?")
    ) {
      try {
        await deleteTeam(teamId);
        await fetchTeamsList();
      } catch (err) {
        console.error("Failed to delete team:", err);
        alert("Failed to delete team.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center space-x-2 font-display">
            <Users className="w-6 h-6 text-amber-800" />
            <span>Excavation Team & Personnel Management</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Record excavation teams, member roles (Director, Archaeologist,
            Field Assistant, Lab Specialist), contact details, and site
            assignment history.
          </p>
        </div>

        <button
          onClick={fetchTeamsList}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <TeamForm
            sites={sites}
            onTeamCreated={handleCreateTeam}
            onMemberAdded={fetchTeamsList}
          />
        </div>

        {/* Directory Column */}
        <div className="lg:col-span-7">
          <TeamTable
            teams={teams}
            loading={loading}
            onDeleteTeam={handleDeleteTeam}
          />
        </div>
      </div>
    </div>
  );
}
