import React, { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import PaginationBar from "../components/PaginationBar";
import { Loader2, AlertCircle, ShoppingBag } from "lucide-react";

export default function CatalogPage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        skip,
        limit,
      };
      if (selectedCategory && selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      if (inStockOnly) {
        params.in_stock = true;
      }

      const data = await api.getProducts(params);
      setProducts(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      const detail =
        err.response?.data?.detail || err.message || "Failed to fetch products";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  }, [skip, limit, selectedCategory, searchTerm, inStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSkip(0);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setSkip(0);
  };

  const handleToggleInStock = (val) => {
    setInStockOnly(val);
    setSkip(0);
  };

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setInStockOnly(false);
    setSkip(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/20">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-300" />
            <span>Curated Product Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore All Products
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Browse our full range of consumer electronics, wearable tech, audio
            gear, and lifestyle products with real-time stock and category
            indexing.
          </p>
        </div>
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            inStockOnly={inStockOnly}
            onToggleInStock={handleToggleInStock}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Failed to load products</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-2 text-xs font-bold text-rose-700 underline hover:text-rose-900"
                >
                  Retry Loading
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">
                Loading catalog products...
              </p>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                No products match the selected category &ldquo;
                {selectedCategory}&rdquo; or search query &ldquo;{searchTerm}
                &rdquo;.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Products Grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              <PaginationBar
                total={total}
                skip={skip}
                limit={limit}
                onPageChange={(newSkip) => setSkip(newSkip)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
