import React, { useState, useEffect } from "react";
import SidebarFilters from "../components/marketplace/SidebarFilters";
import GalleryGrid from "../components/marketplace/GalleryGrid";
import { paintingService } from "../services/api";
import { useCart } from "../components/layout/AppLayout";

export default function PaintingGalleryPage() {
  const [paintings, setPaintings] = useState([]);
  const [filteredPaintings, setFilteredPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const { error, setError, successMessage, setSuccessMessage } = useCart();

  const limit = 20;

  const fetchPaintings = async () => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;
      const data = await paintingService.getPaintings(skip, limit);
      setPaintings(data.items || []);
      setFilteredPaintings(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Failed to fetch paintings:", err);
      setError("Could not load paintings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaintings();
  }, [page]);

  const handleFilterChange = ({ styles }) => {
    if (!styles || styles.length === 0) {
      setFilteredPaintings(paintings);
    } else {
      // Simple local filtering based on style matching description or title keywords
      const filtered = paintings.filter((painting) => {
        const text =
          `${painting.title} ${painting.description || ""}`.toLowerCase();
        return styles.some((style) => text.includes(style.toLowerCase()));
      });
      setFilteredPaintings(filtered);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <header className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Interior Gallery"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDdIOgp48JYqEQU09_jYpDacPwKC1lerZJzI-U_yiXplC9mNXmOMSx-NIZofaEkKmf9TnMpBS38WZfjnAbgADplCOYJBDojNAUnLB-osXgdoBV9V4RrJfSFZg8TVugK9lomJhP1J7kzcTEYxdg1s8wPA7g2Ozawi73gYHrg2TwFgLYiK6r1y54GE-bFCTx-Nz-x9WYu9rwnMVO7WcXDufuHWDQ0RJA_gQXIzGNOZUuUr71_4u5Q3FsWF0JZ-MQohTck2CjOUO60w"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-gutter max-w-3xl">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-4 text-on-tertiary drop-shadow-md">
            Transform Your Walls, Elevate Your Space
          </h1>
          <p className="font-body-lg text-body-lg mb-8 text-surface-container-low drop-shadow">
            Curated original wall paintings from independent artists worldwide.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-container-max mx-auto px-gutter py-12 flex flex-col lg:flex-row gap-gutter w-full">
        <SidebarFilters onFilterChange={handleFilterChange} />

        <section className="flex-grow min-w-0">
          {/* Header/Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-outline-variant pb-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">
                All Paintings
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Showing {filteredPaintings.length} of {total} results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label
                className="font-body-sm text-body-sm text-on-surface-variant"
                htmlFor="sort"
              >
                Sort by:
              </label>
              <select
                className="border border-outline-variant rounded bg-surface py-2 pl-3 pr-8 font-body-sm text-body-sm text-on-surface focus:ring-primary focus:border-primary"
                id="sort"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded border border-error/20 font-body-md text-body-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-primary-container text-on-primary-container rounded border border-primary/20 font-body-md text-body-md">
              {successMessage}
            </div>
          )}

          {/* Art Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Loading paintings...
              </p>
            </div>
          ) : (
            <GalleryGrid paintings={filteredPaintings} />
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border border-outline-variant rounded bg-surface hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-colors font-body-sm text-body-sm"
              >
                Previous
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 flex items-center justify-center rounded font-body-sm text-body-sm font-semibold transition-colors ${
                    page === p
                      ? "bg-primary text-on-primary"
                      : "bg-surface border border-outline-variant hover:bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="p-2 border border-outline-variant rounded bg-surface hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50 transition-colors font-body-sm text-body-sm"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
