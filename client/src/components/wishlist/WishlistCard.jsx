import React from "react";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistCard({ item, onRemove }) {
  const { product } = item;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="aspect-square w-full bg-surface-container-low relative overflow-hidden">
        <img
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
          }
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-on-surface text-lg line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-secondary text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-primary font-bold text-xl">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex-grow flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-medium text-sm rounded-lg h-[38px] px-3 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={() => onRemove(item.id)}
              aria-label="Remove item"
              className="flex items-center justify-center border border-outline-variant hover:border-error text-secondary hover:text-error rounded-lg h-[38px] w-[38px] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
