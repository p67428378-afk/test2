import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { packageService } from "../services/api";

export default function DetailPage() {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const data = await packageService.getPackage(packageId);
        setPkg(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Failed to load package details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 flex-1">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="text-center py-12 text-error bg-error-container/10 rounded-xl p-6 border border-error/20 m-lg">
        <p>{error || "Package not found."}</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-lg w-full max-w-max-content-width mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium mb-4"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Explore
        </Link>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              {pkg.destination}
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface text-3xl font-bold mt-1">
              {pkg.name}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-sm text-on-surface-variant">
                Starting from
              </span>
              <span className="font-headline-lg text-headline-lg text-primary font-bold text-2xl">
                ${pkg.price}
              </span>
              <span className="text-sm text-on-surface-variant"> / person</span>
            </div>
            <Link
              to={`/booking/${pkg.id}`}
              className="bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-3 rounded-lg font-label-md text-label-md shadow-sm transition-colors font-semibold"
            >
              Book This Trip
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Image, Description, Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative h-96 rounded-xl overflow-hidden shadow-md">
            <img
              className="w-full h-full object-cover"
              alt={pkg.name}
              src={
                pkg.image_url ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
              }
            />
            <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/20 flex items-center gap-1 shadow-md">
              <span
                className="material-symbols-outlined text-sm text-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="font-label-md text-label-md text-on-surface font-bold">
                {pkg.rating || "5.0"}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-4">
              About This Package
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Itinerary */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6">
              Day-by-Day Itinerary
            </h3>
            <div className="relative border-l-2 border-outline-variant/30 pl-6 ml-4 space-y-8">
              {pkg.itinerary &&
                pkg.itinerary.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[35px] top-0 bg-primary-container text-on-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                      {item.day}
                    </div>
                    <h4 className="font-semibold text-on-surface text-lg mb-2">
                      {item.title}
                    </h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Inclusions, Reviews */}
        <div className="space-y-8">
          {/* Inclusions */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-4">
              What's Included
            </h3>
            <ul className="space-y-3">
              {pkg.inclusions &&
                pkg.inclusions.map((inc, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-on-surface-variant text-sm"
                  >
                    <span className="material-symbols-outlined text-primary-container text-lg">
                      check_circle
                    </span>
                    <span>{inc}</span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Reviews */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-4">
              Customer Reviews
            </h3>
            <div className="space-y-6">
              {pkg.reviews && pkg.reviews.length > 0 ? (
                pkg.reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="border-b border-outline-variant/20 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-on-surface text-sm">
                        {review.user_name}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-xs text-primary-container"
                            style={{
                              fontVariationSettings:
                                i < review.rating ? "'FILL' 1" : "'FILL' 0",
                            }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-on-surface-variant text-xs leading-relaxed italic">
                      "{review.comment}"
                    </p>
                    <span className="text-[10px] text-outline-variant block mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant text-sm italic">
                  No reviews yet for this package.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
