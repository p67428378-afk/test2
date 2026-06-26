import React from "react";

export default function ProductGrid({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onProductClick,
  viewMode,
}) {
  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest rounded-lg border border-outline-variant">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">
          search_off
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2">
          No products found
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Try adjusting your filters or search query to find what you are
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter"
          : "flex flex-col gap-4"
      }
    >
      {products.map((product) => {
        const inWishlist = isProductInWishlist(product.id);

        if (viewMode === "list") {
          return (
            <div
              key={product.id}
              className="flex bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 p-4 gap-4"
            >
              <div
                onClick={() => onProductClick(product.id)}
                className="relative w-48 aspect-[3/4] bg-surface-container-low overflow-hidden rounded-md cursor-pointer flex-shrink-0"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col flex-grow justify-between py-2">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                        {product.brand}
                      </p>
                      <h3
                        onClick={() => onProductClick(product.id)}
                        className="font-headline-sm text-headline-sm text-on-surface font-semibold hover:text-primary cursor-pointer mt-1"
                      >
                        {product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform border-none cursor-pointer"
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${inWishlist ? "text-error" : "text-on-surface-variant hover:text-error"}`}
                        style={
                          inWishlist
                            ? { fontVariationSettings: "'FILL' 1" }
                            : {}
                        }
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <span
                      className="material-symbols-outlined text-[16px] text-[#FBBF24]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface">
                      {product.rating || "4.5"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onAddToCart(product.id)}
                    className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors border-none cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={product.id}
            className="group flex flex-col bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300"
          >
            <div className="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                onClick={() => onProductClick(product.id)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform border-none cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${inWishlist ? "text-error" : "text-on-surface-variant hover:text-error"}`}
                  style={
                    inWishlist ? { fontVariationSettings: "'FILL' 1" } : {}
                  }
                >
                  favorite
                </span>
              </button>
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onAddToCart(product.id)}
                  className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-2.5 rounded hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors border-none cursor-pointer"
                >
                  Quick Add
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wide">
                {product.brand}
              </p>
              <h3
                onClick={() => onProductClick(product.id)}
                className="font-label-md text-label-md text-on-surface line-clamp-1 mb-2 hover:text-primary cursor-pointer"
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-1 mb-3">
                <span
                  className="material-symbols-outlined text-[16px] text-[#FBBF24]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  {product.rating || "4.5"}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
