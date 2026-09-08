import React, { useState, useEffect } from "react";
import {
  Users,
  Trophy,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import TournamentHeader from "../components/TournamentHeader";
import PlayerRegistrationForm from "../components/PlayerRegistrationForm";
import PlayerRosterTable from "../components/PlayerRosterTable";
import MonthlySummaryStatCard from "../components/dashboard/MonthlySummaryStatCard";
import CategoryBreakdownCard from "../components/dashboard/CategoryBreakdownCard";
import MonthFilter from "../components/expenses/MonthFilter";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseFormModal from "../components/expenses/ExpenseFormModal";
import {
  tournamentService,
  playerService,
  expenseService,
} from "../services/api";

export default function DashboardPage() {
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateTournamentModal, setShowCreateTournamentModal] =
    useState(false);
  const [newTournamentName, setNewTournamentName] = useState("");
  const [newTotalRounds, setNewTotalRounds] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Expense tracker state
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dashboardSummary, setDashboardSummary] = useState({
    active_month: null,
    monthly_total: 0,
    total_expenses: 0,
    category_breakdown: [],
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isExpenseSubmitting, setIsExpenseSubmitting] = useState(false);

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const list = await tournamentService.getTournaments();
      setTournaments(list);
      if (list.length > 0) {
        if (!activeTournament) {
          setActiveTournament(list[0]);
        } else {
          const refreshed =
            list.find((t) => t.id === activeTournament.id) || list[0];
          setActiveTournament(refreshed);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoster = async (tournamentId) => {
    if (!tournamentId) return;
    try {
      const players = await playerService.getRoster(tournamentId);
      setRoster(players);
    } catch (err) {
      console.error(err);
    }
  };

  const loadExpensesData = async () => {
    setExpensesLoading(true);
    try {
      const summary = await expenseService.getDashboardSummary(selectedMonth);
      setDashboardSummary(
        summary || {
          active_month: selectedMonth || null,
          monthly_total: 0,
          total_expenses: 0,
          category_breakdown: [],
        },
      );

      const params = {};
      if (selectedMonth && selectedMonth !== "all") {
        params.month = selectedMonth;
      }
      params.limit = 10;
      const exList = await expenseService.getExpenses(params);
      setRecentExpenses(exList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setExpensesLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    if (activeTournament) {
      loadRoster(activeTournament.id);
    }
  }, [activeTournament]);

  useEffect(() => {
    loadExpensesData();
  }, [selectedMonth]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!newTournamentName.trim()) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const created = await tournamentService.createTournament({
        name: newTournamentName.trim(),
        total_rounds: Number(newTotalRounds) || 5,
      });
      setSuccessMsg(`Tournament '${created.name}' created!`);
      setNewTournamentName("");
      setShowCreateTournamentModal(false);
      loadTournaments();
      setActiveTournament(created);
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Failed to create tournament.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
  };

  const handleFinishTournament = async () => {
    if (!activeTournament) return;
    if (
      !window.confirm(
        `Conclude tournament '${activeTournament.name}' and issue digital certificates?`,
      )
    ) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await tournamentService.finishTournament(activeTournament.id);
      setSuccessMsg(res.message || "Tournament concluded successfully!");
      loadTournaments();
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Failed to conclude tournament.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
  };

  const handleSaveExpense = async (formData) => {
    setIsExpenseSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, formData);
        setSuccessMsg("Expense updated successfully!");
      } else {
        await expenseService.createExpense(formData);
        setSuccessMsg("Expense added successfully!");
      }
      setIsExpenseModalOpen(false);
      setEditingExpense(null);
      loadExpensesData();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || "Failed to save expense.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setIsExpenseSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await expenseService.deleteExpense(id);
      setSuccessMsg("Expense deleted successfully!");
      loadExpensesData();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete expense.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <TournamentHeader
        tournaments={tournaments}
        activeTournament={activeTournament}
        onSelectTournament={(t) => setActiveTournament(t)}
        onOpenRegisterModal={() => setShowRegisterModal(true)}
        onFinishTournament={handleFinishTournament}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Global Banners */}
        {errorMsg && (
          <div
            role="alert"
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center space-x-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section 1: Expense Tracker Summary & Month Filter Controls */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-400" />
                Monthly Expense Summary & Analytics
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Filter spending by month (YYYY-MM) and monitor aggregate monthly
                totals and category breakdowns.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <MonthFilter
                selectedMonth={selectedMonth}
                onChange={(m) => setSelectedMonth(m)}
              />
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setIsExpenseModalOpen(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Expense</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MonthlySummaryStatCard
              monthlyTotal={dashboardSummary.monthly_total}
              selectedMonth={selectedMonth}
              totalExpenses={dashboardSummary.total_expenses}
            />

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Cumulative Expenses
                </span>
                <span className="text-2xl font-bold text-slate-100 mt-1 block">
                  ${Number(dashboardSummary.total_expenses || 0).toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Receipt className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Filtered Items
                </span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">
                  {recentExpenses.length} transactions
                </span>
              </div>
              <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Top Category
                </span>
                <span className="text-lg font-bold text-indigo-300 mt-1 block truncate max-w-[160px]">
                  {dashboardSummary.category_breakdown?.[0]?.category || "None"}
                </span>
              </div>
              <div className="p-3 bg-indigo-600/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CategoryBreakdownCard
                categoryBreakdown={dashboardSummary.category_breakdown}
                selectedMonth={selectedMonth}
              />
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Recent Expenses
                  {selectedMonth && selectedMonth !== "all" && (
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {selectedMonth}
                    </span>
                  )}
                </h3>
                <Link
                  to="/expenses"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <span>View All Expenses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <ExpenseTable
                expenses={recentExpenses}
                onEdit={(e) => {
                  setEditingExpense(e);
                  setIsExpenseModalOpen(true);
                }}
                onDelete={handleDeleteExpense}
                isLoading={expensesLoading}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-slate-800" />

        {/* Section 2: Chess Master System Overview */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Active Tournament
                </span>
                <span className="text-xl font-bold text-white mt-1 block truncate max-w-[180px]">
                  {activeTournament ? activeTournament.name : "None"}
                </span>
              </div>
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Registered Roster
                </span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">
                  {roster.length} Players
                </span>
              </div>
              <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Current Round
                </span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">
                  {activeTournament
                    ? `Round ${activeTournament.current_round}`
                    : "N/A"}
                </span>
              </div>
              <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Tournament Status
                </span>
                <span className="text-xl font-bold text-indigo-300 mt-1 block">
                  {activeTournament ? activeTournament.status : "Inactive"}
                </span>
              </div>
              <div className="p-3 bg-indigo-600/20 text-indigo-300 rounded-xl border border-indigo-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-indigo-900/60 to-slate-900 border border-indigo-500/30 p-6 rounded-xl shadow-xl gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {activeTournament
                  ? activeTournament.name
                  : "Tournament Dashboard"}
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                Manage player registrations, compute FIDE Swiss pairings, record
                match scores, and issue digital certificates.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setShowCreateTournamentModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold rounded-lg shadow transition-colors flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Tournament</span>
              </button>

              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow transition-colors flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Register Player</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PlayerRosterTable
                players={roster}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            <div className="lg:col-span-1">
              <PlayerRegistrationForm
                activeTournamentId={activeTournament?.id}
                onPlayerRegistered={() => loadRoster(activeTournament?.id)}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Expense Modal */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        initialData={editingExpense}
        isSubmitting={isExpenseSubmitting}
      />

      {/* Register Player Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <PlayerRegistrationForm
              activeTournamentId={activeTournament?.id}
              onPlayerRegistered={() => {
                loadRoster(activeTournament?.id);
                setShowRegisterModal(false);
              }}
              onClose={() => setShowRegisterModal(false)}
            />
          </div>
        </div>
      )}

      {/* Create Tournament Modal */}
      {showCreateTournamentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl max-w-md w-full text-slate-100">
            <h3 className="text-xl font-bold text-white mb-4">
              Create New Tournament
            </h3>
            <form onSubmit={handleCreateTournament} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Tournament Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                  placeholder="e.g. FIDE Swiss Open 2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Total Rounds
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={newTotalRounds}
                  onChange={(e) => setNewTotalRounds(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTournamentModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow"
                >
                  Create Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
