import React from "react";
import {
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
  Maximize2,
  Compass,
} from "lucide-react";

export default function LayerControlsHUD({
  layers = [],
  artifacts = [],
  depthFilter,
  setDepthFilter,
  selectedLayerCodes,
  toggleLayerVisibility,
  is2DFallback,
  setIs2DFallback,
  selectedArtifact,
  setSelectedArtifact,
  onResetCamera,
}) {
  return (
    <div className="space-y-4">
      {/* Controls Card */}
      <div className="bg-slate-800/90 backdrop-blur p-4 rounded-lg border border-slate-700 w-full space-y-4 text-white">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-1.5">
            <Layers className="w-4 h-4" />
            <span>3D Trench HUD Controls</span>
          </h3>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-700 text-amber-300 rounded">
            {is2DFallback ? "2D Mode" : "WebGL 3D"}
          </span>
        </div>

        {/* Depth Filter Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Target Depth Filter:</span>
            <span className="text-amber-300 font-bold">{depthFilter}m</span>
          </div>
          <input
            type="range"
            min="-10"
            max="0"
            step="0.1"
            value={depthFilter}
            onChange={(e) => setDepthFilter(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.0m (Surface)</span>
            <span>-10.0m (Bedrock)</span>
          </div>
        </div>

        {/* Strata Layer Visibility Toggles */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Stratigraphic Context Layers
          </p>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {layers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No layers loaded</p>
            ) : (
              layers.map((layer) => {
                const isVisible = selectedLayerCodes.includes(layer.layer_code);
                return (
                  <label
                    key={layer.id || layer.layer_code}
                    className="flex items-center justify-between p-1.5 bg-slate-900/60 hover:bg-slate-700/60 rounded text-xs cursor-pointer border border-slate-700/50"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{
                          backgroundColor: layer.color_hex || "#8B4513",
                        }}
                      />
                      <span className="font-semibold text-slate-200">
                        {layer.layer_code} ({layer.historical_period})
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => toggleLayerVisibility(layer.layer_code)}
                      className="accent-amber-500 rounded"
                    />
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* View Mode & Reset Controls */}
        <div className="flex space-x-2 pt-2 border-t border-slate-700">
          <button
            onClick={() => setIs2DFallback(!is2DFallback)}
            className="flex-1 py-1.5 px-2 bg-slate-700 hover:bg-slate-600 text-xs rounded font-mono text-slate-200 flex items-center justify-center space-x-1"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {is2DFallback ? "Switch to 3D WebGL" : "Switch to 2D Canvas"}
            </span>
          </button>
          {onResetCamera && (
            <button
              onClick={onResetCamera}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
              title="Reset Orbit Camera"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Spatial Artifact Inspector */}
      {selectedArtifact && (
        <div className="bg-slate-800/90 backdrop-blur p-4 rounded-lg border border-amber-500/50 w-full space-y-2 text-white">
          <div className="flex justify-between items-start border-b border-slate-700 pb-2">
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase font-mono">
                Spatial Artifact Inspector
              </h4>
              <p className="text-sm font-extrabold text-white">
                {selectedArtifact.artifact_code}
              </p>
            </div>
            <button
              onClick={() => setSelectedArtifact(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              &times;
            </button>
          </div>
          <div className="space-y-1 text-xs">
            <p className="flex justify-between font-mono text-slate-300">
              <span>Material:</span>
              <span className="font-bold text-amber-300">
                {selectedArtifact.material}
              </span>
            </p>
            <p className="flex justify-between font-mono text-slate-300">
              <span>Context Stratum:</span>
              <span>{selectedArtifact.context_layer || "Unassigned"}</span>
            </p>
            <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-300 space-y-0.5 border border-slate-700">
              <p className="text-slate-400 font-bold mb-1">
                3D Spatial Offset (m):
              </p>
              <div className="grid grid-cols-3 text-center">
                <span>
                  X: {selectedArtifact.x_offset_meters?.toFixed(2) ?? "0.00"}
                </span>
                <span>
                  Y: {selectedArtifact.y_offset_meters?.toFixed(2) ?? "0.00"}
                </span>
                <span>
                  Z: {selectedArtifact.z_depth_meters?.toFixed(2) ?? "0.00"}
                </span>
              </div>
            </div>
            {selectedArtifact.interpolated_depth && (
              <p className="text-[10px] text-amber-400 font-mono italic">
                * Z-depth interpolated from context stratum default
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
