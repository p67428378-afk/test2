import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboard } from "../services/api";
import BalanceCard from "../components/recharge/BalanceCard";
import {
  ArrowRight,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";

export default function RechargeDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "RECHARGED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            <span>RECHARGED</span>
          </span>
        );
      case "ROLLED_BACK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <ShieldAlert className="w-3 h-3" />
            <span>ROLLED BACK</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <Clock className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Prepaid Recharge Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and process mobile & DTH recharges securely via BBPS network.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchDashboard}
            className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/recharge/new"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 shadow-md"
          >
            <span>New Recharge</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <RefreshCw className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="text-gray-500 font-medium">
            Loading dashboard details...
          </p>
        </div>
      ) : (
        <>
          {/* Balance Card */}
          {dashboardData?.linked_account && (
            <BalanceCard account={dashboardData.linked_account} />
          )}

          {/* Monthly Stats */}
          <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-xl shadow-md p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold opacity-90">
                Monthly Recharge Spend
              </h3>
              <p className="text-xs opacity-75 mt-0.5">
                Total spent on successful recharges this month
              </p>
            </div>
            <p className="text-3xl font-black">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(dashboardData?.monthly_stats?.total_amount || 0)}
            </p>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">
                Recent Transactions
              </h3>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                Last 10 activities
              </span>
            </div>

            {dashboardData?.recent_transactions?.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="font-medium">No recent transactions found.</p>
                <p className="text-sm mt-1">
                  Start by initiating a new prepaid recharge.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Account / Mobile</th>
                      <th className="px-6 py-4">Operator</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {dashboardData?.recent_transactions?.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(tx.created_at).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                          {tx.account_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {tx.operator}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                          ₹{tx.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(tx.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
