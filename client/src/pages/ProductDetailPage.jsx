import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  ShoppingCart,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Button from "../components/common/Button.jsx";
import Badge from "../components/common/Badge.jsx";
import { productService } from "../services/api.js";

export default function ProductDetailPage({ productId, onBack, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProduct(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">
          Error Loading Product
        </h3>
        <p className="text-sm text-slate-400">
          {error || "Product not found."}
        </p>
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  const { name, brand, price, stock_quantity, image_url, description } =
    product;

  // Fallback icon based on name
  const getFallbackIcon = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("cpu") || lowerName.includes("processor")) {
      return <Cpu className="h-24 w-24 text-cyan-400" />;
    } else if (
      lowerName.includes("gpu") ||
      lowerName.includes("graphics") ||
      lowerName.includes("nvidia") ||
      lowerName.includes("amd")
    ) {
      return <Monitor className="h-24 w-24 text-cyan-400" />;
    } else if (
      lowerName.includes("ssd") ||
      lowerName.includes("hdd") ||
      lowerName.includes("storage")
    ) {
      return <HardDrive className="h-24 w-24 text-cyan-400" />;
    } else {
      return <Layers className="h-24 w-24 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </button>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div className="relative flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 p-8">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-900/30">
              {getFallbackIcon()}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              {brand}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              {name}
            </h1>
            <div className="flex items-center gap-4 pt-2">
              <div className="text-3xl font-black text-cyan-400">
                ${price.toFixed(2)}
              </div>
              {stock_quantity > 0 ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            {description ||
              "No description available for this premium component."}
          </p>

          {/* Purchase Actions */}
          {stock_quantity > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-400">
                  Quantity:
                </label>
                <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(stock_quantity, quantity + 1))
                    }
                    className="px-3 py-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  {stock_quantity} units available
                </span>
              </div>

              <Button variant="primary" className="w-full py-3 text-base">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800/60 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>3-Year Manufacturer Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
              <span>100% Compatibility Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="pt-12 border-t border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 mb-6">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between p-4 rounded-lg bg-slate-900/20 border border-slate-800/60 text-sm">
            <span className="text-slate-400">Brand</span>
            <span className="font-semibold text-slate-200">{brand}</span>
          </div>
          <div className="flex justify-between p-4 rounded-lg bg-slate-900/20 border border-slate-800/60 text-sm">
            <span className="text-slate-400">Model</span>
            <span className="font-semibold text-slate-200">{name}</span>
          </div>
          <div className="flex justify-between p-4 rounded-lg bg-slate-900/20 border border-slate-800/60 text-sm">
            <span className="text-slate-400">Stock Status</span>
            <span className="font-semibold text-slate-200">
              {stock_quantity > 0
                ? `${stock_quantity} units in stock`
                : "Out of Stock"}
            </span>
          </div>
          <div className="flex justify-between p-4 rounded-lg bg-slate-900/20 border border-slate-800/60 text-sm">
            <span className="text-slate-400">Warranty</span>
            <span className="font-semibold text-slate-200">3 Years</span>
          </div>
        </div>
      </div>
    </div>
  );
}
