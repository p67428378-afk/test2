import React, { useState, useEffect } from "react";
import CategoryFormCard from "../components/categories/CategoryFormCard";
import CategoryTable from "../components/categories/CategoryTable";
import { getCategories, createCategory } from "../services/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (categoryData) => {
    await createCategory(categoryData);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Expense Categories
        </h1>
        <p className="text-sm text-[#707a8c]">
          Manage system default categories and add custom categories for precise
          expense tracking.
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
        <div className="lg:col-span-1">
          <CategoryFormCard onSubmit={handleCreateCategory} />
        </div>
        <div className="lg:col-span-2">
          <CategoryTable categories={categories} loading={loading} />
        </div>
      </div>
    </div>
  );
}
