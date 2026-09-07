import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Navbar from "../components/common/Navbar";
import FilterSidebar from "../components/boxes/FilterSidebar";
import BoxCatalogGrid from "../components/boxes/BoxCatalogGrid";
import { getCategories, getBoxes } from "../services/api";
import { Sparkles, Package, Layers } from "lucide-react";

export default function BoxCatalogPage() {
  const [categories, setCategories] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [billingFrequency, setBillingFrequency] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  const fetchBoxesData = async () => {
    setLoading(true);
    try {
      const data = await getBoxes({
        category_id: selectedCategory,
        max_price: maxPrice < 200 ? maxPrice : undefined,
        min_rating: minRating > 0 ? minRating : undefined,
        search: searchQuery || undefined,
        billing_frequency: billingFrequency || undefined,
        limit: 50,
      });
      setBoxes(data.items || []);
    } catch (err) {
      console.error("Failed to fetch boxes:", err);
      setBoxes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxesData();
  }, [selectedCategory, maxPrice, minRating, searchQuery, billingFrequency]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setMaxPrice(200);
    setMinRating(0);
    setBillingFrequency(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8]">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary via-slate-900 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs px-3 py-1 rounded-full font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Monthly Curations & Authentic Subscriber Reviews</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Discover Subscription Boxes You'll Love
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore handpicked monthly curations across gourmet food, beauty,
              books, wellness, and gaming. Read genuine subscriber reviews
              before you subscribe.
            </p>
          </div>

          <div className="flex gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 text-center">
            <div className="px-3">
              <div className="font-serif text-2xl font-bold text-amber-400">
                {boxes.length}
              </div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider">
                Active Boxes
              </div>
            </div>
            <div className="border-r border-slate-700"></div>
            <div className="px-3">
              <div className="font-serif text-2xl font-bold text-amber-400">
                {categories.length}
              </div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider">
                Categories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minRating={minRating}
            setMinRating={setMinRating}
            billingFrequency={billingFrequency}
            setBillingFrequency={setBillingFrequency}
            onResetFilters={handleResetFilters}
          />

          {/* Catalog Grid View */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="font-serif font-bold text-slate-900 text-xl">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name ||
                      "Filtered Boxes"
                    : "All Subscription Curations"}
                </h2>
                <span className="text-xs font-sans text-slate-500 font-semibold bg-slate-200/60 px-2.5 py-0.5 rounded-full">
                  {boxes.length} {boxes.length === 1 ? "box" : "boxes"}
                </span>
              </div>
            </div>

            <BoxCatalogGrid
              boxes={boxes}
              loading={loading}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-slate-400 py-8 border-t border-slate-800 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-serif font-bold text-slate-200 text-base mb-1">
            CrateCurate
          </p>
          <p>
            © 2026 CrateCurate Subscription Box Finder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
