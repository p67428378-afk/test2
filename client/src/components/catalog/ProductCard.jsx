import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  const {
    product_id,
    name,
    description,
    price,
    image_urls,
    category,
    rating,
    review_count,
    tags,
  } = product;
  const imageUrl =
    image_urls && image_urls.length > 0
      ? image_urls[0]
      : "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&auto=format&fit=crop&q=60";

  return (
    <article class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group overflow-hidden border border-gray-200/50">
      <div class="relative aspect-[1.34] w-full bg-gray-50 overflow-hidden">
        <img
          alt={name}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageUrl}
        />
        {tags && tags.includes("Bestseller") && (
          <div class="absolute top-2 left-2 bg-[#fea619] text-[#2a1700] text-xs font-semibold px-2 py-1 rounded shadow-sm">
            Bestseller
          </div>
        )}
      </div>
      <div class="p-4 flex flex-col flex-1">
        <div class="flex justify-between items-start mb-1">
          <h3 class="font-semibold text-lg leading-tight text-gray-900 line-clamp-1">
            {name}
          </h3>
        </div>
        <p class="text-xs text-gray-500 line-clamp-2 mb-2">{description}</p>
        <div class="flex items-center gap-1 mb-3">
          <span class="material-symbols-outlined filled text-[#fea619] text-sm">
            star
          </span>
          <span class="text-xs font-medium text-gray-600">
            {rating} ({review_count})
          </span>
        </div>
        <div class="flex flex-wrap gap-1 mb-4">
          <span class="bg-[#006c49]/10 text-[#006c49] text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {category}
          </span>
          {tags &&
            tags
              .filter((t) => t !== "Bestseller")
              .map((tag, idx) => (
                <span
                  key={idx}
                  class="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
        </div>
        <div class="mt-auto flex items-center justify-between">
          <span class="font-bold text-lg text-gray-900">
            ${price.toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product_id)}
            class="bg-[#006c49] text-white p-2 rounded-lg hover:bg-[#005236] transition-colors active:scale-95 shadow-sm flex items-center justify-center"
            aria-label={`Add ${name} to cart`}
          >
            <span class="material-symbols-outlined text-sm">
              add_shopping_cart
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
