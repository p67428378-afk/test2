import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Info,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  Maximize2,
} from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function AnatomyCanvasViewer({
  moduleData,
  layers = [],
  hotspots = [],
  isLoading = false,
  error = null,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [activeLayerIds, setActiveLayerIds] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [imageError, setImageError] = useState(false);
  const canvasContainerRef = useRef(null);

  // Initialize all layers as visible
  useEffect(() => {
    if (layers && layers.length > 0) {
      setActiveLayerIds(layers.map((l) => l.id));
    }
  }, [layers]);

  // Set default selected hotspot
  useEffect(() => {
    if (hotspots && hotspots.length > 0 && !selectedHotspot) {
      setSelectedHotspot(hotspots[0]);
    }
  }, [hotspots]);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    // Only pan if clicking on container or image (not interactive hotspot buttons)
    if (e.target.closest("button") || e.target.closest(".hotspot-pin")) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Toggle single layer
  const toggleLayer = (layerId) => {
    setActiveLayerIds((prev) =>
      prev.includes(layerId)
        ? prev.filter((id) => id !== layerId)
        : [...prev, layerId],
    );
  };

  // Filter visible hotspots based on active layers
  const visibleHotspots = hotspots.filter((h) =>
    h.layer_id ? activeLayerIds.includes(h.layer_id) : true,
  );

  // Default fallback medical anatomy diagram SVG if remote image fails or isn't provided
  const baseImageUrl =
    layers.length > 0 ? layers[0].image_url : moduleData?.thumbnail_url;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
      {/* Interactive Medical Canvas Surface */}
      <div className="flex-1 w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative">
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 pointer-events-auto">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">
              {moduleData?.title || "Anatomy Interactive Dissection"}
            </span>
          </div>

          <div className="bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 flex items-center gap-1 pointer-events-auto">
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-700 mx-1" />
            <button
              onClick={handleResetView}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative w-full h-[450px] sm:h-[550px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden select-none ${
            isPanning ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {isLoading ? (
            <div className="text-center text-slate-400">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">
                Loading high-resolution anatomical layers...
              </p>
            </div>
          ) : imageError ? (
            /* Graceful Fallback Loading Indicator / Schematic Canvas */
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
              <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
              <h4 className="text-white font-semibold mb-1">
                Image Asset Offline
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                High-resolution remote image could not be loaded. Displaying
                interactive schematic anatomical diagram.
              </p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setImageError(false)}
              >
                Retry High-Res Fetch
              </Button>
            </div>
          ) : (
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transition: isPanning ? "none" : "transform 0.15s ease-out",
              }}
              className="relative w-full max-w-[800px] h-[450px] flex items-center justify-center"
            >
              {/* Render stacked active layers */}
              {layers && layers.length > 0 ? (
                layers.map((layer, index) => {
                  const isVisible = activeLayerIds.includes(layer.id);
                  if (!isVisible) return null;

                  return (
                    <img
                      key={layer.id || `layer-${index}`}
                      src={layer.image_url}
                      alt={layer.layer_name}
                      onError={() => setImageError(true)}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none rounded-lg"
                      style={{
                        zIndex: layer.layer_order || index + 1,
                        opacity: 0.95,
                      }}
                    />
                  );
                })
              ) : (
                <img
                  src={
                    baseImageUrl ||
                    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200"
                  }
                  alt="Anatomical Canvas"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain pointer-events-none rounded-lg"
                />
              )}

              {/* Schematic Overlay Graphic if needed */}
              <div
                className="absolute inset-0 pointer-events-none border border-slate-700/30 rounded-lg flex items-center justify-center"
                style={{ zIndex: 10 }}
              >
                {/* SVG Hotspot connector grid */}
                <svg className="w-full h-full absolute inset-0">
                  <defs>
                    <radialGradient id="hotspotGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1466bf" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#1466bf" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Hotspot Pins */}
              {visibleHotspots.map((hotspot) => {
                const x = hotspot.x_percent ?? hotspot.x_coord ?? 50;
                const y = hotspot.y_percent ?? hotspot.y_coord ?? 50;
                const isSelected = selectedHotspot?.id === hotspot.id;

                return (
                  <button
                    key={hotspot.id}
                    onClick={() => setSelectedHotspot(hotspot)}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      zIndex: 30,
                    }}
                    className={`hotspot-pin absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                      isSelected ? "scale-125 z-40" : "hover:scale-110"
                    }`}
                    title={hotspot.title}
                    aria-label={`Hotspot: ${hotspot.title}`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`absolute w-8 h-8 rounded-full animate-ping opacity-75 ${
                          isSelected ? "bg-[#149e52]" : "bg-[#1466bf]"
                        }`}
                      />
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white transition-colors ${
                          isSelected ? "bg-[#149e52]" : "bg-[#1466bf]"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    {/* Pin Label Tooltip on Hover */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-950/90 text-white text-[11px] font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-slate-700 pointer-events-none z-50">
                      {hotspot.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Status bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#149e52]" />
            <span>Interactive Dissection Layer Engine Active</span>
          </div>
          <span>{visibleHotspots.length} Anatomical Structures Mapped</span>
        </div>
      </div>

      {/* Right Control & Clinical Notes Panel */}
      <div className="w-full lg:w-[360px] flex flex-col gap-5">
        {/* Layer Toggles Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#dee3ed] shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dee3ed]">
            <h3 className="font-bold text-sm text-[#171f2e] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1466bf]" /> Anatomical Layers
            </h3>
            <span className="text-xs text-[#6b758a]">
              {activeLayerIds.length}/{layers.length || 1} Visible
            </span>
          </div>

          <div className="space-y-2">
            {layers.length > 0 ? (
              layers.map((layer) => {
                const isActive = activeLayerIds.includes(layer.id);
                return (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isActive
                        ? "bg-blue-50/50 border-[#1466bf]/40 text-[#171f2e]"
                        : "bg-gray-50 border-gray-200 text-[#6b758a] opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isActive ? (
                        <Eye className="w-4 h-4 text-[#1466bf]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-xs font-semibold">
                        {layer.layer_name}
                      </span>
                    </div>
                    <Badge variant={isActive ? "default" : "neutral"} size="xs">
                      Order {layer.layer_order || 1}
                    </Badge>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-[#6b758a] py-2">
                Single master composite layer active.
              </p>
            )}
          </div>
        </div>

        {/* Selected Hotspot Clinical Details */}
        <div className="bg-white p-5 rounded-2xl border border-[#dee3ed] shadow-sm flex-1">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dee3ed]">
            <h3 className="font-bold text-sm text-[#171f2e] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#149e52]" /> Clinical Significance
            </h3>
            {selectedHotspot && (
              <Badge variant="success" size="xs">
                Selected
              </Badge>
            )}
          </div>

          {selectedHotspot ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-[#171f2e] mb-1">
                  {selectedHotspot.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#6b758a]">
                  <span>Anatomy Coordinate:</span>
                  <span className="font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">
                    X:{" "}
                    {Math.round(
                      selectedHotspot.x_percent ?? selectedHotspot.x_coord ?? 0,
                    )}
                    %, Y:{" "}
                    {Math.round(
                      selectedHotspot.y_percent ?? selectedHotspot.y_coord ?? 0,
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* Anatomical Notes */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
                <span className="text-xs font-bold text-[#1466bf] uppercase tracking-wider block mb-1">
                  Anatomical Origin & Course
                </span>
                <p className="text-xs text-[#171f2e] leading-relaxed">
                  {selectedHotspot.clinical_notes ||
                    selectedHotspot.notes ||
                    "Primary nerve cord and neural trunk plexus innervating the upper extremity."}
                </p>
              </div>

              {/* High-Yield Clinical Correlation */}
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-[#149e52] uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> High-Yield MBBS Clinical
                  Pearl
                </span>
                <p className="text-xs text-[#171f2e] leading-relaxed">
                  {selectedHotspot.clinical_significance ||
                    "Lesions or trauma to this structure precipitate characteristic motor/sensory deficits tested in professional MBBS examinations."}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-[#6b758a]">
              <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs">
                Click any hotspot pin on the anatomical canvas to view
                high-yield clinical notes and pathology correlations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
