import React, { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { getClaims, getItems } from "../services/api";
import {
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Search,
} from "lucide-react";

export default function ClaimHistoryPage() {
  const [claims, setClaims] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [claimsData, itemsData] = await Promise.all([
        getClaims(),
        getItems(),
      ]);
      setClaims(claimsData);
      setItems(itemsData);
    } catch (err) {
      setError("Failed to load claim history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getItemDetails = (itemId) => {
    return (
      items.find((item) => item.id === itemId) || {
        category: "Unknown",
        item_type: "Unknown",
      }
    );
  };

  const filteredClaims = claims.filter((claim) => {
    const item = getItemDetails(claim.item_id);
    const matchesSearch =
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claimant_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <AppLayout title="Claim History">
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search history by item, claimant, or status..."
              value={searchTerm}
              onChange={(e) => setSearchString(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Secure Audit Log
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* History Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredClaims.length === 0 ? (
            <div className="p-12 text-center">
              <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">
                No claims found
              </h3>
              <p className="text-gray-500 mt-1">
                The claim history log is currently empty.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Claim ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Item Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Claimant ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Verifier ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClaims.map((claim) => {
                    const item = getItemDetails(claim.item_id);
                    return (
                      <tr
                        key={claim.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td
                          className="px-6 py-4 text-sm font-mono text-gray-500 truncate max-w-[120px]"
                          title={claim.id}
                        >
                          {claim.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {item.category}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {item.item_type}
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 font-mono truncate max-w-[150px]"
                          title={claim.claimant_id}
                        >
                          {claim.claimant_id}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 font-mono truncate max-w-[150px]"
                          title={claim.verifier_id || "N/A"}
                        >
                          {claim.verifier_id || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(claim.created_at).toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              claim.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : claim.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {claim.status === "approved" && (
                              <ShieldCheck className="w-3 h-3" />
                            )}
                            {claim.status === "rejected" && (
                              <ShieldAlert className="w-3 h-3" />
                            )}
                            {claim.status === "pending" && (
                              <Clock className="w-3 h-3" />
                            )}
                            <span>{claim.status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
