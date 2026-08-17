import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import DonationForm from "../components/donor/DonationForm";
import ActiveDonationsList from "../components/donor/ActiveDonationsList";
import { donationApi } from "../services/api";

export default function DonorDashboard({ currentUser }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await donationApi.getDonations();
      setDonations(data);
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar userRole={currentUser?.role || "donor"} />
      <main className="flex-1 flex flex-col">
        <Header
          title="Restaurant Donor Portal"
          subtitle="Post surplus food and monitor real-time freshness windows"
          onRefresh={fetchDonations}
        />

        <div className="p-6 space-y-6 max-w-7xl">
          <DonationForm onDonationCreated={fetchDonations} />
          {loading ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              Loading active donations...
            </div>
          ) : (
            <ActiveDonationsList
              donations={donations}
              onRefresh={fetchDonations}
            />
          )}
        </div>
      </main>
    </div>
  );
}
