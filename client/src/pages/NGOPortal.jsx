import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AvailableFoodList from "../components/ngo/AvailableFoodList";
import ClaimRequestPanel from "../components/ngo/ClaimRequestPanel";
import { donationApi, claimApi } from "../services/api";

export default function NGOPortal({ currentUser }) {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsData, claimsData] = await Promise.all([
        donationApi.getDonations(),
        claimApi.getClaims(),
      ]);
      setDonations(donationsData);
      setClaims(claimsData);
    } catch (err) {
      console.error("Failed to fetch NGO portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar userRole={currentUser?.role || "ngo"} />
      <main className="flex-1 flex flex-col">
        <Header
          title="NGO Representative Portal"
          subtitle="Browse active surplus food listings and place claim requests"
          onRefresh={fetchData}
        />

        <div className="p-6 space-y-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {loading ? (
                <div className="p-8 text-center text-slate-500 font-medium">
                  Loading available food...
                </div>
              ) : (
                <AvailableFoodList
                  donations={donations}
                  selectedDonation={selectedDonation}
                  onSelectDonation={(item) => setSelectedDonation(item)}
                />
              )}
            </div>

            <div>
              <ClaimRequestPanel
                donation={selectedDonation}
                onClaimCreated={() => {
                  fetchData();
                  setSelectedDonation(null);
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
