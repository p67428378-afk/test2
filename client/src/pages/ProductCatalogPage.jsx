import React, { useState, useEffect } from "react";
import FilterSidebar from "../components/catalog/FilterSidebar";
import ProductGrid from "../components/catalog/ProductGrid";
import { productService, wishlistService, cartService } from "../services/api";

export default function ProductCatalogPage({
  searchQuery,
  wishlist,
  onUpdateWishlist,
  onUpdateCart,
  onProductClick,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchQuery || undefined,
          category_id: selectedCategory || undefined,
          sort_by: sortBy,
        };
        const data = await productService.getProducts(params);

        // Apply client-side filtering for size, color, brand, and price range
        let filtered = data.items || [];

        if (selectedSizes.length > 0) {
          filtered = filtered.filter((p) => selectedSizes.includes(p.size));
        }
        if (selectedColors.length > 0) {
          filtered = filtered.filter((p) => selectedColors.includes(p.color));
        }
        if (selectedBrands.length > 0) {
          filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
        }
        filtered = filtered.filter(
          (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    selectedSizes,
    selectedColors,
    priceRange,
    selectedBrands,
    sortBy,
  ]);

  const handleToggleWishlist = async (productId) => {
    const inWishlist = wishlist.some((item) => item.product_id === productId);
    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(productId);
      } else {
        await wishlistService.addToWishlist(productId);
      }
      const updated = await wishlistService.getWishlist();
      onUpdateWishlist(updated);
    } catch (err) {
      alert("Please login to manage your wishlist.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartService.updateCart(productId, 1);
      const updated = await cartService.getCart();
      onUpdateCart(updated);
      alert("Product added to cart!");
    } catch (err) {
      alert("Please login to add items to your cart.");
    }
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 200]);
    setSelectedBrands([]);
    setSortBy("popularity");
  };

  const handleToggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleToggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const handleToggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg flex gap-gutter">
      <FilterSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSizes={selectedSizes}
        onToggleSize={handleToggleSize}
        selectedColors={selectedColors}
        onToggleColor={handleToggleColor}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        selectedBrands={selectedBrands}
        onToggleBrand={handleToggleBrand}
        onClearAll={handleClearAll}
      />

      <div className="flex-1 flex flex-col">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant mb-4">
            <span className="hover:text-primary transition-colors cursor-pointer">
              Home
            </span>
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
            <span className="text-on-surface font-medium">Clothing</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Browse Products
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {loading
                  ? "Loading products..."
                  : `Showing ${products.length} items`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none font-label-md text-label-md text-on-surface focus:ring-0 cursor-pointer pr-8 py-0 outline-none"
                >
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <div className="flex border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`p-1.5 cursor-pointer border-none ${viewMode === "grid" ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    grid_view
                  </span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`p-1.5 cursor-pointer border-none ${viewMode === "list" ? "bg-surface-container-highest text-on-surface" : "text-on-surface-variant hover:bg-surface-container-low"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    view_list
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ProductGrid
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onProductClick={onProductClick}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}
