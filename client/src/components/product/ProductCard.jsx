import React from "react";
import { Cpu, Layers, HardDrive, Monitor } from "lucide-react";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";

export default function ProductCard({ product, onViewDetails }) {
  const { id, name, brand, price, stock_quantity, image_url, description } =
    product;

  // Determine stock status
  const getStockBadge = () => {
    if (stock_quantity === 0) {
      return <Badge variant="danger">Out of Stock</Badge>;
    } else if (stock_quantity <= 5) {
      return <Badge variant="warning">Only {stock_quantity} Left</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  // Fallback icon based on name/category
  const getFallbackIcon = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("cpu") || lowerName.includes("processor")) {
      return <Cpu className="h-12 w-12 text-cyan-400" />;
    } else if (
      lowerName.includes("gpu") ||
      lowerName.includes("graphics") ||
      lowerName.includes("nvidia") ||
      lowerName.includes("amd")
    ) {
      return <Monitor className="h-12 w-12 text-cyan-400" />;
    } else if (
      lowerName.includes("ssd") ||
      lowerName.includes("hdd") ||
      lowerName.includes("storage")
    ) {
      return <HardDrive className="h-12 w-12 text-cyan-400" />;
    } else {
      return <Layers className="h-12 w-12 text-cyan-400" />;
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5">
      {/* Product Image / Fallback */}
      <div className="relative flex h-48 items-center justify-center bg-slate-950 p-6">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = ""; // Clear src to show fallback
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-900/50">
            {getFallbackIcon()}
          </div>
        )}
        <div className="absolute top-3 right-3">{getStockBadge()}</div>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {brand}
        </div>
        <h3 className="mb-2 text-sm font-bold text-slate-100 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {name}
        </h3>
        <p className="mb-4 text-xs text-slate-400 line-clamp-2 flex-1">
          {description || "No description available."}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/60">
          <div className="text-lg font-extrabold text-cyan-400">
            ${price.toFixed(2)}
          </div>
          <Button
            variant="primary"
            onClick={() => onViewDetails(id)}
            className="px-3 py-1.5 text-xs"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}
