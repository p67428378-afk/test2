import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, AlertCircle } from "lucide-react";
import FilterPanel from "../components/product/FilterPanel.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import { productService } from "../services/api.js";

export default function ProductListingsPage({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onViewDetails,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  // Unique brands list extracted from products
  const [availableBrands, setAvailableBrands] = useState([]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedCategory) params.category_id = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;
        if (minPrice !== null) params.min_price = minPrice;
        if (maxPrice !== null) params.max_price = maxPrice;
        if (sortBy) params.sort_by = sortBy;
        if (searchQuery) params.search = searchQuery;

        const data = await productService.getProducts(params);
        // The API returns a list of products directly or an object with items
        const items = Array.isArray(data) ? data : data.items || [];
        setProducts(items);

        // Extract unique brands if not already set
        if (items.length > 0 && availableBrands.length === 0) {
          const brands = [...new Set(items.map((p) => p.brand))].filter(
            Boolean,
          );
          setAvailableBrands(brands);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    sortBy,
    searchQuery,
  ]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 pb-16">
      {/* Sidebar Filters */}
      <FilterPanel
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={handleClearFilters}
        brands={availableBrands}
      />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header / Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name ||
                  "Category Products"
                : "All Components"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl border border-slate-800 bg-slate-900/20 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
            <AlertCircle className="h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-300">
              No Products Found
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              We couldn't find any products matching your current filters or
              search query. Try clearing some filters or searching for something
              else.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 text-sm font-semibold text-cyan-400 hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
