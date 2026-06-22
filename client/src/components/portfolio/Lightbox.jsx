import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ image, onClose, onNext, onPrev }) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-primary/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-on-primary hover:text-tertiary-fixed-dim transition-colors p-2 focus:outline-none"
        aria-label="Close lightbox"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Prev Button */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-6 text-on-primary hover:text-tertiary-fixed-dim transition-colors p-2 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}

      {/* Image Container */}
      <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center gap-4">
        <img
          src={image.url}
          alt={image.title || "Photography"}
          className="max-w-full max-h-[70vh] object-contain rounded shadow-2xl animate-scale-up"
        />
        <div className="text-center text-on-primary">
          <h3 className="font-headline-sm text-headline-sm">
            {image.title || "Untitled"}
          </h3>
          {image.gallery_name && (
            <p className="font-label-caps text-label-caps text-surface-container-high mt-1">
              {image.gallery_name}
            </p>
          )}
        </div>
      </div>

      {/* Next Button */}
      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-6 text-on-primary hover:text-tertiary-fixed-dim transition-colors p-2 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}
    </div>
  );
}

Lightbox.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    gallery_id: PropTypes.string.isRequired,
    gallery_name: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
};
