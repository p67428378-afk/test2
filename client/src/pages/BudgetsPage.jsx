import React, { useState, useEffect } from "react";
import { Plus, Tag, Trash2, FolderPlus, Loader2 } from "lucide-react";
import BudgetTable from "../components/BudgetTable";
import SetBudgetModal from "../components/SetBudgetModal";
import BudgetAlertBanner from "../components/BudgetAlertBanner";
import { budgetApi, categoryApi } from "../services/api";

export default function BudgetsPage({ currentUser }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");

  // Category Creation Form State
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState("Expense");
  const [catCreating, setCatCreating] = useState(false);
  const [catError, setCatError] = useState("");

  // Set Budget Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetModalLoading, setBudgetModalLoading] = useState(false);
  const [budgetModalError, setBudgetModalError] = useState("");

  const fetchBudgets = async () => {
    setLoadingBudgets(true);
    setError("");
    try {
      const data = await budgetApi.getBudgets(month);
      setBudgets(data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load monthly budgets.");
    } finally {
      setLoadingBudgets(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await categoryApi.getCategories();
      setCategories(data || []);
    } catch {
      // Ignored
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, currentUser]);

  useEffect(() => {
    fetchCategories();
  }, [currentUser]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCatError("Category name is required.");
      return;
    }
    setCatCreating(true);
    setCatError("");
    try {
      await categoryApi.createCategory({
        name: newCatName.trim(),
        type: newCatType,
      });
      setNewCatName("");
      fetchCategories();
    } catch (err) {
      setCatError(err.response?.data?.detail || "Failed to create category.");
    } finally {
      setCatCreating(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      await categoryApi.deleteCategory(id);
      fetchCategories();
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete category.");
    }
  };

  const handleSetBudgetSubmit = async (payload) => {
    setBudgetModalLoading(true);
    setBudgetModalError("");
    try {
      await budgetApi.setBudget(payload);
      setIsBudgetModalOpen(false);
      fetchBudgets();
    } catch (err) {
      setBudgetModalError(
        err.response?.data?.detail || "Failed to set monthly budget.",
      );
    } finally {
      setBudgetModalLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this category budget limit?",
      )
    ) {
      return;
    }
    try {
      await budgetApi.deleteBudget(id);
      fetchBudgets();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete budget limit.");
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "Expense");
  const incomeCategories = categories.filter((c) => c.type === "Income");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Category & Budget Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure spending categories and set monthly thresholds with
            automated warning alerts
          </p>
        </div>
      </div>

      {/* Global Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Threshold Alert Banners */}
      <BudgetAlertBanner budgets={budgets} />

      {/* Main Grid: Custom Categories & Monthly Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Category Manager */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add Category Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-blue-600" />
              Add Custom Category
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Create categories for granular expense or income tracking
            </p>

            {catError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                {catError}
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions, Groceries..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCatType("Expense")}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      newCatType === "Expense"
                        ? "bg-rose-50 border-rose-300 text-rose-700 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType("Income")}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      newCatType === "Income"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={catCreating}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {catCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Category
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Existing Categories List */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-600" />
              Existing Categories
            </h3>

            {loadingCategories ? (
              <div className="py-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Expense Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-rose-600 tracking-wider mb-2">
                    Expense Categories ({expenseCategories.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {expenseCategories.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md transition-colors"
                      >
                        <span>{c.name}</span>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          title="Delete category"
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Income Categories */}
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase text-emerald-600 tracking-wider mb-2">
                    Income Categories ({incomeCategories.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {incomeCategories.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs px-2.5 py-1 rounded-md transition-colors"
                      >
                        <span>{c.name}</span>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          title="Delete category"
                          className="text-emerald-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Monthly Category Budgets Table */}
        <div className="lg:col-span-2">
          <BudgetTable
            budgets={budgets}
            month={month}
            onMonthChange={setMonth}
            onOpenSetBudget={() => {
              setBudgetModalError("");
              setIsBudgetModalOpen(true);
            }}
            onDelete={handleDeleteBudget}
            loading={loadingBudgets}
          />
        </div>
      </div>

      {/* Set Budget Modal */}
      <SetBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={handleSetBudgetSubmit}
        categories={categories}
        defaultMonth={month}
        loading={budgetModalLoading}
        error={budgetModalError}
      />
    </div>
  );
}
