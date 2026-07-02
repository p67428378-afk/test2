import React from "react";
import AppLayout from "../components/layout/AppLayout";
import AgentTable from "../components/admin/AgentTable";
import { adminService } from "../services/api";

export default function AgentManagementPage() {
  const [agents, setAgents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchAgents = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await adminService.listAgents();
      setAgents(data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load delivery agents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddAgent = async (agentData) => {
    try {
      await adminService.addAgent(agentData);
      await fetchAgents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to register agent.");
      throw err;
    }
  };

  return (
    <AppLayout title="Agent & Delivery Management">
      <div className="space-y-6 max-w-5xl">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <AgentTable agents={agents} onAddAgent={handleAddAgent} />
        )}
      </div>
    </AppLayout>
  );
}
