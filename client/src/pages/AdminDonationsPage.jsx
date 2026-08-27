import React, { useState, useEffect } from "react";
import { FileSpreadsheet, ShieldCheck, AlertTriangle } from "lucide-react";
import DonationAuditLedgerTable from "../components/admin/DonationAuditLedgerTable";
import { donationsAPI } from "../services/api";

export default function AdminDonationsPage({ currentUser }) {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [donorNameFilter, setDonorNameFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await donationsAPI.getDonations({
        skip,
        limit,
        donor_name: donorNameFilter || undefined,
      });
      setDonations(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(
        "Failed to fetch donation audit records. Please verify admin privileges.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [skip, limit, donorNameFilter]);

  const handlePageChange = (newSkip) => {
    setSkip(Math.max(0, newSkip));
  };

  const handleFilterChange = (filters) => {
    if (filters.donor_name !== undefined) {
      setDonorNameFilter(filters.donor_name);
      setSkip(0);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <span>Audit & Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Donation Audit Ledger
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Comprehensive transaction audit ledger with real-time donor tracking
            and CSV export options.
          </p>
        </div>
      </div>

      {/* Admin Warning Banner if not Admin user */}
      {currentUser && currentUser.role !== "Admin" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Viewing all donation audit records requires an Admin role. Use{" "}
            <code>admin@example.com</code> / <code>adminpassword</code> to sign
            in as Admin.
          </span>
        </div>
      )}

      {/* Main Audit Ledger Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 animate-pulse">
          Loading donation audit records...
        </div>
      ) : (
        <DonationAuditLedgerTable
          donations={donations}
          total={total}
          skip={skip}
          limit={limit}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
}
