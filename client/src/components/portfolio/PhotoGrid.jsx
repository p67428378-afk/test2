import React from "react";
import PropTypes from "prop-types";

export default function PhotoGrid({
  images,
  onImageClick,
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <section className="py-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-stack-md mb-stack-lg md:mb-margin-desktop">
        <button
          onClick={() => onCategoryChange("All")}
          className={`px-6 py-2 rounded-full font-label-caps text-label-caps transition-all ${
            selectedCategory === "All"
              ? "bg-tertiary-fixed-dim text-on-tertiary-fixed"
              : "bg-transparent text-on-surface-variant border border-outline-variant hover:border-outline"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.name)}
            className={`px-6 py-2 rounded-full font-label-caps text-label-caps transition-all ${
              selectedCategory === cat.name
                ? "bg-tertiary-fixed-dim text-on-tertiary-fixed"
                : "bg-transparent text-on-surface-variant border border-outline-variant hover:border-outline"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant font-body-lg">
          No images found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {images.map((img) => (
            <div
              key={img.id}
              className="group cursor-pointer"
              onClick={() => onImageClick(img)}
            >
              <div className="gallery-image-container rounded bg-surface-container-low aspect-[4/5] mb-stack-sm shadow-sm relative">
                <img
                  alt={img.title || "Photography"}
                  className="gallery-image w-full h-full object-cover"
                  src={img.url}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  {img.title || "Untitled"}
                </h3>
                {img.gallery_name && (
                  <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">
                    {img.gallery_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

PhotoGrid.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      gallery_id: PropTypes.string.isRequired,
      gallery_name: PropTypes.string,
    }),
  ).isRequired,
  onImageClick: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};
