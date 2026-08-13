import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { paintingService } from "../services/api";
import { useCart } from "../components/layout/AppLayout";

export default function PaintingDetailPage() {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart, error, setError, successMessage, setSuccessMessage } =
    useCart();

  useEffect(() => {
    const fetchPainting = async () => {
      try {
        setLoading(true);
        const data = await paintingService.getPainting(id);
        setPainting(data);
        setNotFound(false);
      } catch (err) {
        console.error("Failed to fetch painting:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPainting();
  }, [id]);

  const handleAddToCart = async () => {
    setError("");
    setSuccessMessage("");
    if (painting) {
      await addToCart(painting.id);
    }
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-12 text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Loading painting details...
        </p>
      </div>
    );
  }

  if (notFound || !painting) {
    return (
      <div className="max-w-container-max mx-auto px-gutter py-12 text-center flex flex-col items-center gap-6">
        <h2 className="font-display-lg text-display-lg text-error">
          404 - Painting Not Found
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          The painting you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps px-8 py-4 rounded transition-colors uppercase tracking-widest shadow-md"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label-caps text-label-caps mb-8 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Back to Gallery
      </Link>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Column */}
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-surface-container-low border border-outline-variant shadow-sm">
          <img
            alt={painting.title}
            className="w-full h-full object-cover"
            src={painting.image_url}
          />
        </div>

        {/* Details Column */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
              Original Painting
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface mt-2 mb-1">
              {painting.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              By {painting.artist_name}
            </p>
          </div>

          <div className="border-t border-b border-outline-variant py-4 flex justify-between items-center">
            <span className="font-display-lg text-headline-lg text-primary font-bold">
              ${parseFloat(painting.price).toFixed(2)}
            </span>
            {painting.dimensions && (
              <span className="font-body-md text-body-md text-tertiary">
                Dimensions: {painting.dimensions}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
              Description
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {painting.description ||
                "No description available for this artwork."}
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full md:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps px-12 py-4 rounded transition-colors uppercase tracking-widest shadow-md"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
