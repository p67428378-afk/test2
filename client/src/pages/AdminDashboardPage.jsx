import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import FineStatusTable from "../components/fines/FineStatusTable";
import IssueFineFormModal from "../components/admin/IssueFineFormModal";
import AuditTrailTable from "../components/admin/AuditTrailTable";
import { adminFineService, authService } from "../services/api";
import {
  PlusCircle,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
} from "lucide-react";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [fines, setFines] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedFineId, setSelectedFineId] = useState(null);
  const [isLoadingFines, setIsLoadingFines] = useState(true);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  // Check auth on load
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    } else {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setIsLoadingFines(true);
    setDashboardError("");
    try {
      const data = await adminFineService.listFines();
      setFines(data || []);
      fetchAuditLogs();
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        authService.logout();
        navigate("/login");
      } else {
        setDashboardError(
          err.response?.data?.detail || "Failed to load fine records.",
        );
      }
    } finally {
      setIsLoadingFines(false);
    }
  };

  const fetchAuditLogs = async (fineId = null) => {
    setIsLoadingAudit(true);
    try {
      const logs = await adminFineService.listAuditLogs(fineId);
      setAuditLogs(logs || []);
    } catch {
      // audit log failure fallback
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleCreateFine = async (fineData) => {
    await adminFineService.createFine(fineData);
    await fetchDashboardData();
  };

  const handleUpdateStatus = async (fineId, updateData) => {
    await adminFineService.updateFine(fineId, updateData);
    await fetchDashboardData();
  };

  const handleVoidFine = async (fineId, notes) => {
    await adminFineService.voidFine(fineId, notes);
    await fetchDashboardData();
  };

  const handleViewAudit = (fineId) => {
    setSelectedFineId(fineId);
    fetchAuditLogs(fineId);
  };

  const handleClearAuditFilter = () => {
    setSelectedFineId(null);
    fetchAuditLogs(null);
  };

  // Compute metrics
  const totalCitations = fines.length;
  const activeUnpaidAmount = fines
    .filter((f) => f.status === "UNPAID" || f.status === "OVERDUE")
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const overdueCount = fines.filter((f) => f.status === "OVERDUE").length;
  const paidCount = fines.filter((f) => f.status === "PAID").length;
  const collectionRate =
    totalCitations > 0 ? Math.round((paidCount / totalCitations) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Fine Management Dashboard
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Issue citations, manage fine statuses, process void requests, and
              inspect audit trails.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              className="p-2 border border-slate-300 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Issue New Fine</span>
            </button>
          </div>
        </div>

        {dashboardError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
            {dashboardError}
          </div>
        )}

        {/* Metrics Overview Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Citations
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalCitations}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Outstanding Unpaid
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ${activeUnpaidAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overdue Citations
              </span>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {overdueCount}
              </p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Collection Rate
              </span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {collectionRate}%
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Fines Management Data Table */}
        <FineStatusTable
          fines={fines}
          onUpdateStatus={handleUpdateStatus}
          onVoidFine={handleVoidFine}
          onViewAudit={handleViewAudit}
          isLoading={isLoadingFines}
        />

        {/* Audit Log Table */}
        <div className="space-y-2">
          {selectedFineId && (
            <div className="flex justify-end">
              <button
                onClick={handleClearAuditFilter}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Clear Audit Log Filter (Show All Logs)
              </button>
            </div>
          )}
          <AuditTrailTable
            logs={auditLogs}
            isLoading={isLoadingAudit}
            fineIdFilter={selectedFineId}
          />
        </div>
      </main>

      {/* Issue Fine Modal */}
      <IssueFineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFine}
      />
    </div>
  );
}
