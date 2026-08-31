import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  MapPin,
  ShieldCheck,
  ThermometerSnowflake,
  Check,
} from "lucide-react";
import { getChocolateById } from "../services/api";
import { useCart } from "../context/CartContext";
import HeatSensitivityAlert from "../components/product/HeatSensitivityAlert";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [chocolate, setChocolate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [stockError, setStockError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChocolateById(id);
        setChocolate(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail || err.message || "Chocolate not found",
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleQuantityChange = (newQty) => {
    if (!chocolate) return;
    setStockError(null);
    if (newQty < 1) return;
    if (newQty > chocolate.stock_quantity) {
      setStockError(
        `Only ${chocolate.stock_quantity} items remaining in stock.`,
      );
      return;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (!chocolate || chocolate.stock_quantity <= 0) return;
    setStockError(null);

    if (quantity > chocolate.stock_quantity) {
      setStockError(
        `Only ${chocolate.stock_quantity} items remaining in stock.`,
      );
      return;
    }

    try {
      setAdding(true);
      await addItem(chocolate, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setStockError(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-pulse space-y-8">
          <div className="h-6 bg-stone-200 rounded w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 bg-stone-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4" />
              <div className="h-6 bg-stone-200 rounded w-1/4" />
              <div className="h-24 bg-stone-200 rounded" />
              <div className="h-12 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chocolate) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#E8E2DC] shadow-sm">
          <div className="text-4xl mb-4">🍫</div>
          <h2 className="font-heading text-xl font-bold text-[#2D1B18] mb-2">
            Chocolate Item Not Found
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            {error || "This artisanal creation is unavailable."}
          </p>
          <Link
            to="/chocolates"
            className="inline-flex items-center px-5 py-2.5 bg-[#2D1B18] text-[#D4AF37] rounded-xl text-sm font-bold shadow hover:bg-[#1A0F0D]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = chocolate.stock_quantity <= 0;
  const isLowStock =
    chocolate.stock_quantity > 0 && chocolate.stock_quantity <= 3;
  const flavorList = chocolate.flavor_notes
    ? chocolate.flavor_notes.split(",").map((f) => f.trim())
    : [];

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-semibold text-stone-600 hover:text-[#2D1B18] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to chocolates
        </button>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-10 shadow-sm">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#2D1B18] via-[#3D2521] to-[#1A0F0D] p-8 text-white flex flex-col items-center justify-center min-h-[360px] shadow-inner">
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF37] text-[#1A0F0D] shadow">
                  {chocolate.cocoa_percentage}% Pure Cacao
                </span>
              </div>

              <div className="text-8xl filter drop-shadow-2xl my-auto animate-bounce">
                🍫
              </div>

              <div className="w-full text-center mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-stone-300 block uppercase tracking-widest">
                  Single-Origin Harvest
                </span>
                <span className="text-base font-semibold text-[#F4E8C1] flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-[#D4AF37]" />
                  {chocolate.origin_region}
                </span>
              </div>
            </div>

            {/* Heat Advisory Callout Banner */}
            {chocolate.is_heat_sensitive && (
              <HeatSensitivityAlert compact={false} />
            )}
          </div>

          {/* Right Product Information Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Badges & Origin */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F7F3EE] text-[#2D1B18] border border-[#E8E2DC]">
                  {chocolate.origin_region}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F7F3EE] text-stone-700 border border-[#E8E2DC]">
                  {chocolate.dietary_flags}
                </span>
                {isOutOfStock ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Only {chocolate.stock_quantity} left
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    In Stock ({chocolate.stock_quantity} available)
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl sm:text-4xl font-bold text-[#2D1B18] leading-tight">
                {chocolate.title}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-[#2D1B18]">
                  ${Number(chocolate.price).toFixed(2)}
                </span>
                <span className="text-xs text-stone-500">
                  USD &bull; Net Wt. 85g / 3.0 oz
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 space-y-3 text-sm text-stone-700 leading-relaxed border-t border-[#E8E2DC] pt-6">
                <h3 className="font-heading text-base font-bold text-[#2D1B18]">
                  Artisan Tasting Profile &amp; Provenance
                </h3>
                <p>
                  {chocolate.description ||
                    "Rare cacao beans stone-ground in micro-batches with organic cocoa butter."}
                </p>
              </div>

              {/* Flavor Profile Tags */}
              {flavorList.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Key Flavor Notes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {flavorList.map((note) => (
                      <span
                        key={note}
                        className="inline-flex items-center text-xs bg-[#FDFBF7] text-[#2D1B18] font-medium px-3 py-1.5 rounded-lg border border-[#E8E2DC]"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" />
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions & Quantity Selector */}
            <div className="pt-6 border-t border-[#E8E2DC] space-y-4">
              {stockError && (
                <div
                  data-testid="stock-error-message"
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700"
                >
                  {stockError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity Controls */}
                <div className="flex items-center border-2 border-[#E8E2DC] rounded-xl bg-[#FDFBF7] p-1 justify-between sm:w-36">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={isOutOfStock || quantity <= 1 || adding}
                    className="p-2 text-stone-600 hover:text-[#2D1B18] disabled:opacity-30 rounded-lg hover:bg-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm text-[#2D1B18] px-2">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={
                      isOutOfStock ||
                      quantity >= chocolate.stock_quantity ||
                      adding
                    }
                    className="p-2 text-stone-600 hover:text-[#2D1B18] disabled:opacity-30 rounded-lg hover:bg-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || adding}
                  data-testid="add-to-cart-button"
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
                    isOutOfStock
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : added
                        ? "bg-emerald-600 text-white"
                        : "bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] shadow-lg hover:shadow-xl hover:scale-[1.01]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span>Added to Tasting Box!</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>
                        {adding
                          ? "Adding..."
                          : `Add to Cart &bull; $${(chocolate.price * quantity).toFixed(2)}`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 text-xs text-stone-500 pt-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Fair-Trade Certified Cacao</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ThermometerSnowflake className="w-4 h-4 text-[#00796B]" />
                  <span>Thermal Packaging Eligible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
