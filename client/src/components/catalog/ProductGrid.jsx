import React from "react";
import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products, onAddToCart, loading }) {
  if (loading) {
    return (
      <div class="flex justify-center items-center py-20 flex-1">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006c49]"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div class="text-center py-20 flex-1 bg-white rounded-lg border border-gray-100 shadow-sm">
        <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">
          inventory_2
        </span>
        <h3 class="text-lg font-semibold text-gray-700 mb-1">
          No products found
        </h3>
        <p class="text-sm text-gray-500">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
