import React, { useState, useEffect } from "react";
import { donationService } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BrowseDonationsGrid from "../components/BrowseDonationsGrid";
import Badge from "../components/Badge";
import { Search, Filter } from "lucide-react";

export default function NGODashboardPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [foodTypeFilter, setFoodTypeFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (foodTypeFilter) params.food_type = foodTypeFilter;
      if (quantityFilter) params.quantity = quantityFilter;
      const data = await donationService.listDonations(params);
      setDonations(data);
    } catch (err) {
      setError("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [foodTypeFilter, quantityFilter]);

  const availableDonations = donations.filter((d) => d.status === "available");
  const myRequests = donations.filter(
    (d) =>
      d.status === "requested" ||
      d.status === "assigned" ||
      d.status === "picked_up" ||
      d.status === "delivered",
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[280px] w-[calc(100%-280px)] overflow-hidden">
        <Header title="NGO Dashboard" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1440px] mx-auto space-y-8">
            {/* Filters Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                Filter Donations
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Food Type (e.g. Veg)"
                  value={foodTypeFilter}
                  onChange={(e) => setFoodTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-700"
                />
                <input
                  type="text"
                  placeholder="Quantity (e.g. 10 meals)"
                  value={quantityFilter}
                  onChange={(e) => setQuantityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Available Donations Grid */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800">
                Available Donations
              </h3>
              {loading ? (
                <div className="text-center py-12 text-slate-500">
                  Loading available donations...
                </div>
              ) : error ? (
                <div className="text-center py-12 text-rose-500">{error}</div>
              ) : (
                <BrowseDonationsGrid
                  donations={availableDonations}
                  onRequested={fetchDonations}
                />
              )}
            </div>

            {/* My Requested Donations */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">
                  My Requested Donations
                </h3>
              </div>
              {loading ? (
                <div className="p-6 text-center text-slate-500">
                  Loading requests...
                </div>
              ) : myRequests.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  You haven't requested any donations yet.
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
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                      {myRequests.map((donation) => (
                        <tr
                          key={donation.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {donation.description}
                          </td>
                          <td className="px-6 py-4">
                            {donation.restaurant_name}
                          </td>
                          <td className="px-6 py-4">{donation.quantity}</td>
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
        </main>
      </div>
    </div>
  );
}
