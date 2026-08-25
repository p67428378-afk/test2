import React, { useState, useEffect, useCallback } from "react";
import {
  PlusCircle,
  Upload,
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";
import ExpenseTable from "../components/expenses/ExpenseTable";
import FilterBar from "../components/expenses/FilterBar";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Button from "../components/common/Button";
import {
  getExpenses,
  getCategories,
  createExpense,
  updateExpense,
  deleteExpense,
  createCategory,
  formatApiError,
} from "../services/api";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // Filter & Pagination state
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("#2663eb");

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 4000);
  };

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      showNotification("error", formatApiError(err));
    }
  }, []);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        skip: (currentPage - 1) * pageSize,
        limit: pageSize,
        search: search.trim() || undefined,
        category_id: categoryId || undefined,
        payment_method: paymentMethod || undefined,
        sort_by: sortBy,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };
      const data = await getExpenses(params);
      setExpenses(data);
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    search,
    categoryId,
    paymentMethod,
    sortBy,
    startDate,
    endDate,
    pageSize,
  ]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setPaymentMethod("");
    setSortBy("date_desc");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleSaveExpense = async (payload, onDone) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, payload);
        showNotification(
          "success",
          `Updated expense "${payload.title}" successfully.`,
        );
      } else {
        await createExpense(payload);
        showNotification(
          "success",
          `Created expense "${payload.title}" successfully.`,
        );
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      if (onDone) onDone();
      loadExpenses();
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id, onDone) => {
    try {
      await deleteExpense(id);
      showNotification("success", "Expense deleted successfully.");
      loadExpenses();
    } catch (err) {
      showNotification("error", formatApiError(err));
    } finally {
      if (onDone) onDone();
    }
  };

  const handleCreateNewCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const newCat = await createCategory({
        name: newCatName.trim(),
        color: newCatColor,
        icon: "tag",
      });
      showNotification("success", `Created category "${newCat.name}"`);
      setNewCatName("");
      setIsNewCategoryOpen(false);
      loadCategories();
    } catch (err) {
      showNotification("error", formatApiError(err));
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Toast Notification */}
      {notification.message && (
        <div
          role="alert"
          className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm transition-all ${
            notification.type === "error"
              ? "bg-rose-50 border-rose-200 text-[#db2626]"
              : "bg-emerald-50 border-emerald-200 text-[#17a34a]"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle className="w-5 h-5 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171c29] tracking-tight">
            All Expense Transactions
          </h1>
          <p className="text-sm text-[#707a8c] mt-1">
            Search, filter, categorize, and manage your full transaction
            history.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            icon={Tag}
            onClick={() => setIsNewCategoryOpen(true)}
          >
            + New Category
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={() => {
              setEditingExpense(null);
              setIsFormOpen(true);
            }}
          >
            + Add Expense
          </Button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <FilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setCurrentPage(1);
        }}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(val) => {
          setSortBy(val);
          setCurrentPage(1);
        }}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setCurrentPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setCurrentPage(1);
        }}
        categories={categories}
        onReset={handleResetFilters}
      />

      {/* Modal / Overlay for Add/Edit Expense */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <ExpenseForm
              categories={categories}
              onSubmit={handleSaveExpense}
              initialData={editingExpense}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingExpense(null);
              }}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Modal for New Custom Category */}
      {isNewCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e3e8f0]">
              <h3 className="text-base font-bold text-[#171c29]">
                Add New Category
              </h3>
              <button
                type="button"
                onClick={() => setIsNewCategoryOpen(false)}
                className="text-[#707a8c] hover:text-[#171c29]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleCreateNewCategory}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cat-name-input"
                  className="text-xs font-medium text-[#707a8c]"
                >
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="cat-name-input"
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Fitness & Sports"
                  className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="cat-color-input"
                  className="text-xs font-medium text-[#707a8c]"
                >
                  Category Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="cat-color-input"
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[#e3e8f0] p-1"
                  />
                  <span className="text-xs text-[#707a8c] font-mono">
                    {newCatColor}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e3e8f0]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsNewCategoryOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Records Card */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#171c29]">
            Transaction Records
          </h2>
          <span className="text-xs text-[#707a8c] font-medium">
            {expenses.length} Records Shown
          </span>
        </div>

        <ExpenseTable
          expenses={expenses}
          isLoading={isLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteExpense}
          currentPage={currentPage}
          totalRecords={
            expenses.length < pageSize && currentPage === 1
              ? expenses.length
              : 50
          }
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          showPagination={true}
        />
      </div>
    </div>
  );
}
