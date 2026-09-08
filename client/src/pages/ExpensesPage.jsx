import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, AlertCircle, CheckCircle2 } from "lucide-react";
import TournamentHeader from "../components/TournamentHeader";
import MonthFilter from "../components/expenses/MonthFilter";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseFormModal from "../components/expenses/ExpenseFormModal";
import { expenseService, tournamentService } from "../services/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadTournaments = async () => {
    try {
      const list = await tournamentService.getTournaments();
      setTournaments(list);
      if (list.length > 0 && !activeTournament) {
        setActiveTournament(list[0]);
      }
    } catch {
      // optional
    }
  };

  const loadExpenses = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const params = {};
      if (selectedMonth && selectedMonth !== "all") {
        params.month = selectedMonth;
      }
      const data = await expenseService.getExpenses(params);
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Failed to load expenses. Please ensure the backend is reachable.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth]);

  // Compute available categories from expenses list
  const categories = useMemo(() => {
    const set = new Set();
    expenses.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set);
  }, [expenses]);

  // Filter expenses by search term and category
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !searchTerm.trim() ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchTerm]);

  // Summary banner metrics
  const summaryStats = useMemo(() => {
    const totalSpending = filteredExpenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    const totalItems = filteredExpenses.length;
    const highestExpense = filteredExpenses.reduce(
      (max, item) => Math.max(max, Number(item.amount) || 0),
      0,
    );
    return { totalSpending, totalItems, highestExpense };
  }, [filteredExpenses]);

  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (formData) => {
    setIsSubmitting(true);
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
      setIsModalOpen(false);
      setEditingExpense(null);
      loadExpenses();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || "Failed to save expense.";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await expenseService.deleteExpense(id);
      setSuccessMsg("Expense deleted successfully!");
      loadExpenses();
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
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Expense Tracker
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              View and filter expenses by month, manage category spending, and
              track monthly summaries.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow transition-colors flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Expense</span>
          </button>
        </div>

        {/* Banners */}
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

        {/* Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search description or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 pl-9 pr-3 py-1.5 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category Select Filter */}
            <div className="relative inline-flex items-center">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Month Filter Selector */}
          <MonthFilter
            selectedMonth={selectedMonth}
            onChange={(m) => setSelectedMonth(m)}
          />
        </div>

        {/* Monthly Summary Banner */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 p-4 rounded-xl shadow-md flex flex-wrap justify-between items-center gap-4 text-sm">
          <span className="font-semibold text-white">
            {selectedMonth && selectedMonth !== "all"
              ? `${selectedMonth} Summary`
              : "Overall Summary"}
          </span>
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
            <span>
              Total Spending:{" "}
              <strong className="text-white text-base">
                ${summaryStats.totalSpending.toFixed(2)}
              </strong>
            </span>
            <span className="text-indigo-400">|</span>
            <span>
              Total Items:{" "}
              <strong className="text-white">{summaryStats.totalItems}</strong>
            </span>
            <span className="text-indigo-400">|</span>
            <span>
              Highest Expense:{" "}
              <strong className="text-white">
                ${summaryStats.highestExpense.toFixed(2)}
              </strong>
            </span>
          </div>
        </div>

        {/* Expenses List Table */}
        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteExpense}
          isLoading={isLoading}
          selectedMonth={selectedMonth}
        />
      </main>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        initialData={editingExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
