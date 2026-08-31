import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Plus, Check, ThermometerSnowflake, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";

export const ChocolateCard = ({ chocolate }) => {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(null);

  const isOutOfStock = chocolate.stock_quantity <= 0;
  const isLowStock =
    chocolate.stock_quantity > 0 && chocolate.stock_quantity <= 3;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    try {
      setAdding(true);
      setAddError(null);
      await addItem(chocolate, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const flavorList = chocolate.flavor_notes
    ? chocolate.flavor_notes.split(",").map((f) => f.trim())
    : [];

  return (
    <div
      data-testid={`chocolate-card-${chocolate.id}`}
      className="group relative bg-white rounded-2xl border border-[#E8E2DC] hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Top Banner & Badges */}
      <div className="relative bg-gradient-to-br from-[#2D1B18] via-[#3D2521] to-[#1A0F0D] p-6 text-white flex flex-col justify-between min-h-[160px]">
        {/* Cocoa Badge & Heat Warning */}
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#D4AF37] text-[#1A0F0D] shadow">
            {chocolate.cocoa_percentage}% Cocoa
          </span>

          {chocolate.is_heat_sensitive && (
            <span
              title="Heat-Sensitive: Cold-pack shipping recommended"
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF3E0] text-[#E65100] border border-[#E65100]/30 shadow-sm"
            >
              <ThermometerSnowflake className="w-3 h-3 mr-1 text-[#E65100]" />
              Heat-Sensitive
            </span>
          )}
        </div>

        {/* Visual Graphic Representation */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform duration-300">
            🍫
          </div>
          <div className="text-right">
            <span className="text-[11px] text-stone-300 uppercase tracking-widest block">
              Origin
            </span>
            <span className="text-sm font-semibold text-[#F4E8C1]">
              {chocolate.origin_region}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title with link */}
          <Link
            to={`/chocolates/${chocolate.id}`}
            className="block font-heading text-lg font-bold text-[#2D1B18] group-hover:text-[#D4AF37] transition-colors line-clamp-1"
          >
            {chocolate.title}
          </Link>

          {/* Description */}
          {chocolate.description && (
            <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {chocolate.description}
            </p>
          )}

          {/* Flavor Notes Tags */}
          {flavorList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {flavorList.slice(0, 3).map((note) => (
                <span
                  key={note}
                  className="inline-flex items-center text-[10px] bg-[#F7F3EE] text-stone-700 px-2 py-0.5 rounded-md border border-[#E8E2DC]"
                >
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-[#D4AF37]" />
                  {note}
                </span>
              ))}
            </div>
          )}

          {/* Dietary & Stock warning */}
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-stone-500">{chocolate.dietary_flags}</span>
            {isOutOfStock ? (
              <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                Only {chocolate.stock_quantity} remaining
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">In Stock</span>
            )}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="mt-5 pt-4 border-t border-[#E8E2DC] flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block">Price</span>
            <span className="text-xl font-heading font-bold text-[#2D1B18]">
              ${Number(chocolate.price).toFixed(2)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/chocolates/${chocolate.id}`}
              className="px-3 py-2 text-xs font-semibold text-[#2D1B18] hover:bg-[#F7F3EE] rounded-lg transition-colors border border-[#E8E2DC]"
            >
              Details
            </Link>

            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || adding}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                isOutOfStock
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                  : added
                    ? "bg-emerald-600 text-white"
                    : "bg-[#2D1B18] hover:bg-[#1A0F0D] text-white hover:shadow"
              }`}
              aria-label={`Add ${chocolate.title} to cart`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{adding ? "Adding..." : "Add"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {addError && (
          <div className="mt-2 text-[11px] text-red-600 font-medium">
            {addError}
          </div>
        )}
      </div>
    </div>
  );
};

ChocolateCard.propTypes = {
  chocolate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    cocoa_percentage: PropTypes.number.isRequired,
    origin_region: PropTypes.string.isRequired,
    flavor_notes: PropTypes.string,
    dietary_flags: PropTypes.string,
    price: PropTypes.number.isRequired,
    stock_quantity: PropTypes.number.isRequired,
    is_heat_sensitive: PropTypes.bool,
  }).isRequired,
};

export default ChocolateCard;
