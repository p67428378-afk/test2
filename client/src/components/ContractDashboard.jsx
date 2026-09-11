import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

export default function ContractDashboard({
  contracts = [],
  loading,
  onRefresh,
  onCreateClick,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Stats calculation
  const totalCount = contracts.length;
  const pendingApprovals = contracts.filter((c) =>
    ["Legal Review", "Finance Approval", "Pending Signature"].includes(
      c.status,
    ),
  ).length;
  const executedCount = contracts.filter((c) => c.status === "Executed").length;

  const now = new Date();
  const expiringSoonCount = contracts.filter((c) => {
    if (!c.termination_date) return false;
    const termDate = new Date(c.termination_date);
    const diffDays = Math.ceil((termDate - now) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 60 && c.status !== "Expired";
  }).length;

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contract_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Legal Review":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Finance Approval":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Pending Signature":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Executed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Expired":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Total Contracts
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {totalCount}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Active lifecycle
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Pending Approvals
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendingApprovals}
            </p>
            <p className="text-xs text-slate-500 mt-1">Requires review</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Expiring in 60 Days
            </p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {expiringSoonCount}
            </p>
            <p className="text-xs text-rose-500 font-medium mt-1">
              Renewal alerts
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Executed Contracts
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {executedCount}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Active SLAs
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search contracts by title, ID, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-lg text-sm px-3 py-2 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Legal Review">Legal Review</option>
              <option value="Finance Approval">Finance Approval</option>
              <option value="Pending Signature">Pending Signature</option>
              <option value="Executed">Executed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-sm flex items-center gap-1"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onCreateClick}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Draft Contract
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading contracts...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">
              No contracts found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your filters or create a new contract draft.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Contract Info</th>
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Version</th>
                  <th className="px-6 py-3">Value</th>
                  <th className="px-6 py-3">Term Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {contract.title}
                      </div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">
                        {contract.contract_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {contract.vendor?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                          contract.status,
                        )}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {contract.current_version ||
                        `v${contract.version_number || 1}.0`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      $
                      {contract.total_value
                        ? contract.total_value.toLocaleString()
                        : "0"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {contract.termination_date || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/contracts/${contract.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-md inline-block"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
