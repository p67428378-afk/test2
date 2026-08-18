import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ExpenseFormCard from "../components/expenses/ExpenseFormCard";
import ExpenseFilterBar from "../components/expenses/ExpenseFilterBar";
import ExpenseTable from "../components/expenses/ExpenseTable";
import {
  getExpenses,
  getCategories,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/api";

export default function ExpensesPage() {
  const location = useLocation();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingExpense, setEditingExpense] = useState(
    location.state?.editingExpense || null,
  );

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
      const map = {};
      (data || []).forEach((c) => {
        map[c.id] = c.name;
      });
      setCategoriesMap(map);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (categoryId) params.category_id = categoryId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await getExpenses(params);
      setExpenses(response.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, []);

  const handleApplyFilters = () => {
    fetchExpenses();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategoryId("");
    setStartDate("");
    setEndDate("");
    getExpenses().then((res) => setExpenses(res.items || []));
  };

  const handleFormSubmit = async (formData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
    } else {
      await createExpense(formData);
    }
    fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        alert("Failed to delete expense.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Expenses & Logging
        </h1>
        <p className="text-sm text-[#707a8c]">
          Log new expenses, filter transactions, and manage your spending
          records.
        </p>
      </div>

      {error && (
        <div
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <ExpenseFormCard
            categories={categories}
            onSubmit={handleFormSubmit}
            editingExpense={editingExpense}
            onCancelEdit={() => setEditingExpense(null)}
          />
        </div>

        {/* Directory Column */}
        <div className="lg:col-span-2 space-y-4">
          <ExpenseFilterBar
            search={search}
            setSearch={setSearch}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            categories={categories}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          <ExpenseTable
            expenses={expenses}
            categoriesMap={categoriesMap}
            onEdit={(exp) => {
              setEditingExpense(exp);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDeleteExpense}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
