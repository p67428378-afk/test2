import React from "react";
import AppLayout from "../components/layout/AppLayout";
import KPIGrid from "../components/dashboard/KPIGrid";
import ShipmentTable from "../components/dashboard/ShipmentTable";
import {
  QuickAssignModal,
  StatusUpdateModal,
} from "../components/admin/QuickAssign";
import { shipmentService, adminService } from "../services/api";

export default function DashboardPage() {
  const [shipments, setShipments] = React.useState([]);
  const [agents, setAgents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [activeAssignShipment, setActiveAssignShipment] = React.useState(null);
  const [activeStatusShipment, setActiveStatusShipment] = React.useState(null);

  const role = localStorage.getItem("role") || "customer";
  const isAdmin = role === "admin";

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const shipmentData = await shipmentService.listShipments();
      setShipments(shipmentData.items || []);

      if (isAdmin) {
        const agentData = await adminService.listAgents();
        setAgents(agentData.items || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleAssignAgent = async (shipmentId, agentId) => {
    try {
      await adminService.assignAgent(shipmentId, agentId);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to assign agent.");
    }
  };

  const handleUpdateStatus = async (shipmentId, statusData) => {
    try {
      await adminService.updateStatus(shipmentId, statusData);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-8">
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
          <>
            <KPIGrid shipments={shipments} />
            <ShipmentTable
              shipments={shipments}
              isAdmin={isAdmin}
              onAssignClick={setActiveAssignShipment}
              onStatusClick={setActiveStatusShipment}
            />
          </>
        )}

        {activeAssignShipment && (
          <QuickAssignModal
            shipment={activeAssignShipment}
            agents={agents}
            onClose={() => setActiveAssignShipment(null)}
            onAssign={handleAssignAgent}
          />
        )}

        {activeStatusShipment && (
          <StatusUpdateModal
            shipment={activeStatusShipment}
            onClose={() => setActiveStatusShipment(null)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </AppLayout>
  );
}
