import React, { useState, useEffect } from "react";
import ArtworkConfigurator from "../components/ArtworkConfigurator.jsx";
import { paintingService, configuratorService } from "../services/api.js";
import { Sliders, Sparkles } from "lucide-react";

export default function ConfiguratorPage({
  selectedPainting,
  onAddToCart,
  onBack,
}) {
  const [painting, setPainting] = useState(selectedPainting || null);
  const [frameOptions, setFrameOptions] = useState([]);
  const [availablePaintings, setAvailablePaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const frames = await configuratorService.getFrameOptions();
        setFrameOptions(frames || []);

        const catalogRes = await paintingService.getPaintings({
          is_configurable: true,
        });
        const items = catalogRes.items || [];
        setAvailablePaintings(items);

        if (!painting && items.length > 0) {
          setPainting(items[0]);
        }
      } catch (err) {
        console.error("Configurator page error", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        Loading Interactive Artwork Configurator...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Switch Painting Selector */}
      {availablePaintings.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Select Artwork Base Design:
            </span>
          </div>
          <select
            value={painting?.id || ""}
            onChange={(e) => {
              const found = availablePaintings.find(
                (p) => p.id === e.target.value,
              );
              if (found) setPainting(found);
            }}
            className="w-full sm:w-80 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
          >
            {availablePaintings.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (${parseFloat(p.base_price).toFixed(2)})
              </option>
            ))}
          </select>
        </div>
      )}

      {painting ? (
        <ArtworkConfigurator
          painting={painting}
          frameOptions={frameOptions}
          onAddToCart={onAddToCart}
          onBack={onBack}
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          No configurable artwork selected. Please select a painting from the
          catalog.
        </div>
      )}
    </div>
  );
}
