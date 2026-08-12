import React, { useState, useEffect } from "react";
import SidebarFilter from "../components/SidebarFilter.jsx";
import CatalogGrid from "../components/CatalogGrid.jsx";
import { paintingService } from "../services/api.js";
import { Sparkles, Sliders, ShoppingBag, X } from "lucide-react";

export default function CatalogPage({ searchQuery, onConfigure, onAddToCart }) {
  const [paintings, setPaintings] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: searchQuery || "",
    style: "",
    medium: "",
    min_price: "",
    max_price: "",
    is_configurable: "",
    is_original_one_of_one: "",
  });

  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery || "" }));
  }, [searchQuery]);

  const fetchPaintings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await paintingService.getPaintings(filters);
      setPaintings(data.items || []);
      setSuggestions(data.suggestions || null);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load wall painting catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: "",
      style: "",
      medium: "",
      min_price: "",
      max_price: "",
      is_configurable: "",
      is_original_one_of_one: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Curated Fine Artwork Collection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Original Handcrafted Wall Paintings
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Discover one-of-a-kind original oil and acrylic masterpieces, or
            order custom stretched canvas dimensions tailored precisely to your
            space.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Catalog Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Filter */}
        <SidebarFilter
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
        />

        {/* Right Catalog Grid */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>
              Showing {paintings.length} of {total} artworks
            </span>
            {filters.search && (
              <span>
                Search query:{" "}
                <strong className="text-amber-400">"{filters.search}"</strong>
              </span>
            )}
          </div>

          {loading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Loading artwork catalog...
            </div>
          ) : (
            <CatalogGrid
              paintings={paintings}
              suggestions={suggestions}
              total={total}
              onSelectPainting={setSelectedDetail}
              onConfigure={onConfigure}
              onAddToCart={onAddToCart}
            />
          )}
        </div>
      </div>

      {/* Modal for Artwork Detail */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={
                    selectedDetail.image_url ||
                    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={selectedDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">
                    {selectedDetail.title}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium mt-1">
                    Artist: {selectedDetail.artist_name || "Featured Master"}
                  </p>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <p>
                    <strong>Style:</strong> {selectedDetail.style}
                  </p>
                  <p>
                    <strong>Medium:</strong> {selectedDetail.medium}
                  </p>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {selectedDetail.stock_quantity > 0
                      ? "In Stock"
                      : "Sold Out"}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedDetail.description ||
                    "Original gallery-wrapped painting crafted with professional archival pigments and hand-stretched canvas."}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-black text-amber-400">
                    ${parseFloat(selectedDetail.base_price).toFixed(2)}
                  </span>

                  {selectedDetail.is_configurable ? (
                    <button
                      onClick={() => {
                        const item = selectedDetail;
                        setSelectedDetail(null);
                        onConfigure(item);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <Sliders className="h-4 w-4" />
                      Configure Dimensions
                    </button>
                  ) : (
                    <button
                      disabled={selectedDetail.stock_quantity < 1}
                      onClick={() => {
                        const item = selectedDetail;
                        setSelectedDetail(null);
                        onAddToCart(item);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
