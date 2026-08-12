import React, { useState, useEffect } from "react";
import FrameSelector from "./FrameSelector.jsx";
import DynamicPriceCalculator from "./DynamicPriceCalculator.jsx";
import {
  Sliders,
  ShoppingBag,
  Eye,
  Shield,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { configuratorService } from "../services/api.js";

export default function ArtworkConfigurator({
  painting,
  frameOptions = [],
  onAddToCart,
  onBack,
}) {
  const [width, setWidth] = useState(36);
  const [height, setHeight] = useState(48);
  const [selectedFrameId, setSelectedFrameId] = useState(
    frameOptions.length > 0 ? frameOptions[0].id : null,
  );

  const [calcResult, setCalcResult] = useState({
    base_price: painting?.base_price || 250,
    calculated_unit_price: painting?.base_price || 250,
    area_sq_inches: 1728,
    frame_fee: 0,
    is_valid: true,
    validation_error: null,
  });

  const [loading, setLoading] = useState(false);

  // Validate bounds locally
  const isValidBounds =
    width >= 12 && width <= 120 && height >= 12 && height <= 120;

  const localValidationError = !isValidBounds
    ? `Dimensions must be between 12" and 120" in width and height. Current: ${width}" x ${height}".`
    : null;

  useEffect(() => {
    if (!painting) return;

    if (!isValidBounds) {
      setCalcResult((prev) => ({
        ...prev,
        is_valid: false,
        validation_error: localValidationError,
      }));
      return;
    }

    const fetchPrice = async () => {
      setLoading(true);
      try {
        const res = await configuratorService.calculatePrice({
          painting_id: painting.id,
          custom_width_inches: width,
          custom_height_inches: height,
          frame_option_id: selectedFrameId,
        });
        setCalcResult(res);
      } catch (err) {
        console.error("Configurator price error", err);
        setCalcResult((prev) => ({
          ...prev,
          is_valid: false,
          validation_error:
            err.response?.data?.detail || "Failed to calculate dynamic price.",
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [painting, width, height, selectedFrameId]);

  if (!painting) return null;

  const handleAddToCart = () => {
    if (!calcResult.is_valid || !isValidBounds) return;
    onAddToCart({
      painting_id: painting.id,
      custom_width_inches: width,
      custom_height_inches: height,
      frame_option_id: selectedFrameId,
      quantity: 1,
      unit_price: calcResult.calculated_unit_price,
    });
  };

  // Compute aspect ratio for visual room simulator box
  const aspectRatio = width / (height || 1);
  const maxBoxWidth = 320;
  let boxWidth = Math.min(maxBoxWidth, width * 3);
  let boxHeight = boxWidth / (aspectRatio || 1);
  if (boxHeight > 320) {
    boxHeight = 320;
    boxWidth = boxHeight * aspectRatio;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </button>
        <div className="text-right">
          <h2 className="text-xl font-bold text-slate-100">{painting.title}</h2>
          <p className="text-xs text-amber-400 font-medium">
            Interactive Room Configurator
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Room Simulator Preview */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-amber-400" />
              Live Wall Simulation
            </span>
            <span className="text-xs font-semibold text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Scale: {width}" W &times; {height}" H
            </span>
          </div>

          {/* Wall Background & Artwork Canvas Container */}
          <div className="relative aspect-[16/10] bg-gradient-to-b from-slate-950 via-slate-900 to-stone-900 rounded-2xl border border-slate-800 p-8 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Sofa Silhouette for Room Scale context */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-slate-800/40 rounded-t-3xl border-t border-slate-700/30 flex items-center justify-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">
                Modern Living Room Sofa (84" Width)
              </span>
            </div>

            {/* Configured Painting Canvas Box */}
            <div
              style={{
                width: `${boxWidth}px`,
                height: `${boxHeight}px`,
              }}
              className="relative shadow-2xl transition-all duration-300 rounded-sm overflow-hidden flex items-center justify-center bg-slate-950 border-4 border-amber-900/60"
            >
              <img
                src={
                  painting.image_url ||
                  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
                }
                alt={painting.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center italic">
            Visual room preview renders approximate scale relative to standard
            84" furniture.
          </p>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dimension Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Sliders className="h-4 w-4" />
                Custom Dimensions
              </h3>
              <span className="text-xs text-slate-400">
                Bounds: 12" to 120"
              </span>
            </div>

            {/* Width Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                <label>Width (Inches)</label>
                <input
                  type="number"
                  min="12"
                  max="120"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-amber-400 font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <input
                type="range"
                min="12"
                max="120"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                <label>Height (Inches)</label>
                <input
                  type="number"
                  min="12"
                  max="120"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-right text-amber-400 font-bold text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <input
                type="range"
                min="12"
                max="120"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Standard Preset Buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Standard Size Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { w: 24, h: 36, label: '24" x 36"' },
                  { w: 36, h: 48, label: '36" x 48"' },
                  { w: 48, h: 60, label: '48" x 60"' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setWidth(preset.w);
                      setHeight(preset.h);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                      width === preset.w && height === preset.h
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frame Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <FrameSelector
              frameOptions={frameOptions}
              selectedFrameId={selectedFrameId}
              onSelectFrame={setSelectedFrameId}
            />
          </div>

          {/* Price Breakdown */}
          <DynamicPriceCalculator
            basePrice={calcResult.base_price}
            customWidth={width}
            customHeight={height}
            areaSqInches={calcResult.area_sq_inches}
            frameFee={calcResult.frame_fee}
            calculatedUnitPrice={calcResult.calculated_unit_price}
            isValid={calcResult.is_valid && isValidBounds}
            validationError={
              calcResult.validation_error || localValidationError
            }
          />

          {/* Add to Cart Button */}
          <button
            disabled={!calcResult.is_valid || !isValidBounds || loading}
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              !calcResult.is_valid || !isValidBounds || loading
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {!calcResult.is_valid || !isValidBounds
              ? "Invalid Dimensions"
              : `Add Custom Painting to Cart — $${parseFloat(calcResult.calculated_unit_price || 0).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
