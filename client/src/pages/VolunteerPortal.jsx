import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import ActiveDeliveryCard from "../components/volunteer/ActiveDeliveryCard";
import ProofOfDeliveryForm from "../components/volunteer/ProofOfDeliveryForm";
import { deliveryApi } from "../services/api";

export default function VolunteerPortal({ currentUser }) {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const data = await deliveryApi.getDeliveries();
      setDeliveries(data);
      if (data && data.length > 0) {
        setSelectedDelivery(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar userRole={currentUser?.role || "volunteer"} />
      <main className="flex-1 flex flex-col">
        <Header
          title="Volunteer Delivery Portal"
          subtitle="Accept dispatch tasks, follow route navigation, and submit proof of delivery"
          onRefresh={fetchDeliveries}
        />

        <div className="p-6 space-y-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="p-8 text-center text-slate-500 font-medium">
                  Loading dispatch tasks...
                </div>
              ) : (
                <ActiveDeliveryCard
                  deliveries={deliveries}
                  onDeliveryUpdated={fetchDeliveries}
                />
              )}
            </div>

            <div>
              <ProofOfDeliveryForm
                delivery={selectedDelivery}
                onProofSubmitted={fetchDeliveries}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
