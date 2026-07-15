import React, { useState, useEffect } from "react";
import { loanService } from "../services/api";
import ProductCard from "../components/loans/ProductCard";
import EMICalculator from "../components/loans/EMICalculator";
import { Filter, RefreshCw, AlertCircle } from "lucide-react";

export default function LoanProductsPage({ onApply }) {
  const [products, setProducts] = useState([]);
  const [selectedProductForCalc, setSelectedProductForCalc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [tenureFilter, setTenureFilter] = useState("");
  const [maxEmiFilter, setMaxEmiFilter] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (typeFilter) params.type = typeFilter;
      if (tenureFilter) params.tenure = parseInt(tenureFilter, 10);
      if (maxEmiFilter) params.max_emi = parseFloat(maxEmiFilter);

      const data = await loanService.getProducts(params);
      setProducts(data);
    } catch (err) {
      setError("Failed to load loan products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [typeFilter, tenureFilter, maxEmiFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Available Loan Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Explore our competitive loan offerings and calculate your monthly
            repayments in real time.
          </p>
        </div>
        <button
          onClick={fetchProducts}
          className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2 text-slate-500" />
          Refresh
        </button>
      </div>

      {/* Filters Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filter Products</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Loan Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="Personal">Personal Loan</option>
              <option value="Auto">Auto Loan</option>
              <option value="Education">Education Loan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Desired Tenure (Months)
            </label>
            <input
              type="number"
              value={tenureFilter}
              onChange={(e) => setTenureFilter(e.target.value)}
              placeholder="e.g. 24"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Max Affordable EMI ($)
            </label>
            <input
              type="number"
              value={maxEmiFilter}
              onChange={(e) => setMaxEmiFilter(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm">
            No loan products match your filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onApply={onApply}
              onSelectForCalculator={setSelectedProductForCalc}
            />
          ))}
        </div>
      )}

      {/* EMI Calculator Section */}
      {!loading && products.length > 0 && (
        <EMICalculator
          selectedProduct={selectedProductForCalc}
          products={products}
        />
      )}
    </div>
  );
}
