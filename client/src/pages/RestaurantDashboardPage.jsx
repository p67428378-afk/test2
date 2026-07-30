import React, { useState, useEffect } from "react";
import { donationService } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CreateDonationForm from "../components/CreateDonationForm";
import Badge from "../components/Badge";
import { TrendingUp, Package, CheckCircle, ShieldAlert } from "lucide-react";

export default function RestaurantDashboardPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDonations = async () => {
    try {
      const data = await donationService.listDonations();
      setDonations(data);
    } catch (err) {
      setError("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Calculate stats
  const totalDonations = donations.length;
  const activeListings = donations.filter(
    (d) => d.status === "available",
  ).length;
  const completedDeliveries = donations.filter(
    (d) => d.status === "delivered",
  ).length;
  const foodSaved = donations.reduce((acc, d) => {
    const qty = parseFloat(d.quantity) || 0;
    return acc + qty;
  }, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[280px] w-[calc(100%-280px)] overflow-hidden">
        <Header title="Restaurant Dashboard" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1440px] mx-auto space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Total Donations
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">
                    {totalDonations}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +8%
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Active Listings
                </span>
                <span className="text-3xl font-bold text-slate-800">
                  {activeListings}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Completed Deliveries
                </span>
                <span className="text-3xl font-bold text-slate-800">
                  {completedDeliveries}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <span className="text-xs font-bold text-slate-500 uppercase mb-2">
                  Food Saved
                </span>
                <span className="text-3xl font-bold text-slate-800">
                  {foodSaved}{" "}
                  <span className="text-sm text-slate-500">units</span>
                </span>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Create Donation Form */}
              <div className="lg:col-span-5">
                <CreateDonationForm onSuccess={fetchDonations} />
              </div>

              {/* Right Column: My Donations Table */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm">
                  <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Package className="w-5 h-5 text-slate-800" />
                      My Donations
                    </h3>
                  </div>

                  {loading ? (
                    <div className="p-6 text-center text-slate-500">
                      Loading donations...
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center text-rose-500">{error}</div>
                  ) : donations.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      No donations posted yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                              Description
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                              Best Before
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                          {donations.map((donation) => (
                            <tr
                              key={donation.id}
                              className="hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-6 py-4 font-medium text-slate-900">
                                {donation.description}
                              </td>
                              <td className="px-6 py-4">{donation.quantity}</td>
                              <td className="px-6 py-4">
                                {new Date(
                                  donation.best_before_dt,
                                ).toLocaleString()}
                              </td>
                              <td className="px-6 py-4">
                                <Badge status={donation.status} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
