import React, { useState, useEffect } from "react";
import PaymentLedgerTable from "../components/admin/PaymentLedgerTable";
import {
  packageService,
  paymentService,
  sessionService,
} from "../services/api";
import {
  Package,
  Plus,
  DollarSign,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AdminPackageLedgerPage() {
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [isAddPackageModalOpen, setIsAddPackageModalOpen] = useState(false);
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgPrice, setNewPkgPrice] = useState("450.00");
  const [newPkgDuration, setNewPkgDuration] = useState("90");
  const [newPkgDeliverables, setNewPkgDeliverables] = useState(
    "1.5 hrs coverage • 25 edited photos",
  );
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [pkgs, pmts, sess] = await Promise.all([
        packageService.getPackages().catch(() => []),
        paymentService.getPayments().catch(() => []),
        sessionService.getSessions().catch(() => []),
      ]);
      setPackages(pkgs);
      setPayments(pmts);
      setSessions(sess);
    } catch (err) {
      console.warn("Using sample admin package data:", err);
    }
  };

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    try {
      const created = await packageService.createPackage({
        name: newPkgName,
        price: parseFloat(newPkgPrice),
        duration_minutes: parseInt(newPkgDuration),
        deliverables_summary: newPkgDeliverables,
      });
      setStatusMessage(`Package "${created.name}" created successfully!`);
      setIsAddPackageModalOpen(false);
      setNewPkgName("");
      fetchAdminData();
    } catch (err) {
      console.error("Create package error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Admin Package Catalog & Payment Ledger Dashboard
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Manage photography packages, deliverables, pricing, and track
            session payment states.
          </p>
        </div>

        <button
          onClick={() => setIsAddPackageModalOpen(true)}
          className="bg-[#775A19] hover:bg-[#5f4613] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl mb-6 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Payment Ledger Table & Metrics */}
      <PaymentLedgerTable
        packages={packages}
        payments={payments}
        sessions={sessions}
      />

      {/* Add Package Modal */}
      {isAddPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">
              Add New Photography Package
            </h3>
            <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  required
                  placeholder="e.g. Commercial Branding Package"
                  className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    required
                    step="0.01"
                    className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    value={newPkgDuration}
                    onChange={(e) => setNewPkgDuration(e.target.value)}
                    required
                    className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Deliverables Summary
                </label>
                <input
                  type="text"
                  value={newPkgDeliverables}
                  onChange={(e) => setNewPkgDeliverables(e.target.value)}
                  required
                  className="w-full border border-stone-300 p-2.5 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddPackageModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-bold rounded-lg hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#775A19] hover:bg-[#5f4613] text-white font-bold rounded-lg shadow-sm"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
