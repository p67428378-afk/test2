import React, { useState, useEffect } from "react";
import TopNavBar from "./components/layout/TopNavBar.jsx";
import Homepage from "./pages/Homepage.jsx";
import ProductListingsPage from "./pages/ProductListingsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import { categoryService, productService } from "./services/api.js";
import { AlertCircle } from "lucide-react";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("homepage"); // 'homepage', 'listings', 'details:id'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data (categories and featured products)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cats = await categoryService.getCategories();
        setCategories(Array.isArray(cats) ? cats : []);

        const prods = await productService.getProducts({ limit: 4 });
        const items = Array.isArray(prods) ? prods : prods.items || [];
        setFeaturedProducts(items);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError(
          "Failed to load store data. Please ensure the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearchSubmit = () => {
    setCurrentView("listings");
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const renderActivePage = () => {
    if (currentView === "homepage") {
      return (
        <Homepage
          categories={categories}
          onNavigate={handleNavigate}
          setSelectedCategory={setSelectedCategory}
          featuredProducts={featuredProducts}
        />
      );
    }

    if (currentView === "listings") {
      return (
        <ProductListingsPage
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onViewDetails={(id) => setCurrentView(`details:${id}`)}
        />
      );
    }

    if (currentView.startsWith("details:")) {
      const productId = currentView.split(":")[1];
      return (
        <ProductDetailPage
          productId={productId}
          onBack={() => setCurrentView("listings")}
          onNavigate={handleNavigate}
        />
      );
    }

    return (
      <Homepage
        categories={categories}
        onNavigate={handleNavigate}
        setSelectedCategory={setSelectedCategory}
        featuredProducts={featuredProducts}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <TopNavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-400">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          </div>
        ) : (
          renderActivePage()
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} PartForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
