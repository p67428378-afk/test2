import React, { useState, useEffect } from "react";
import ExpenseFilterBar from "../components/expenses/ExpenseFilterBar";
import ExpenseTable from "../components/expenses/ExpenseTable";
import { getExpenses, deleteExpense } from "../services/api";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ExpensesPage({
  onOpenAddModal,
  onEditExpense,
  refreshTrigger = 0,
}) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * pageSize;
      const params = {
        skip,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const data = await getExpenses(params);
      setExpenses(data || []);
      // If server returns total items or length
      setTotalCount(data ? data.length + (page - 1) * pageSize : 0);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Failed to load expenses list. Please check API connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [
    page,
    search,
    category,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    refreshTrigger,
  ]);

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Delete expense failed:", err);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Expenses Directory
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View, filter, edit, and manage all your expense records
          </p>
        </div>
        <button
          onClick={fetchExpenses}
          disabled={isLoading}
          className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 self-start sm:self-auto"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter Bar */}
      <ExpenseFilterBar
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setPage(1);
        }}
        startDate={startDate}
        setStartDate={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        setEndDate={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        onReset={handleReset}
        onOpenAddModal={onOpenAddModal}
      />

      {/* Error Notice */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={fetchExpenses}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-bold px-3 py-1 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Expense Table */}
      <ExpenseTable
        expenses={expenses}
        onEdit={onEditExpense}
        onDelete={handleDelete}
        isLoading={isLoading}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => setPage(p)}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}
