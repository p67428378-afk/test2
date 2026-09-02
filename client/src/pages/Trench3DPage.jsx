import React, { useState, useEffect } from "react";
import { Box, Layers, Plus, Compass, AlertCircle } from "lucide-react";
import TrenchVisualizer3D from "../components/mapping/TrenchVisualizer3D";
import LayerControlsHUD from "../components/mapping/LayerControlsHUD";
import {
  getSites,
  getSiteStratigraphy,
  addSiteStratigraphicLayer,
  getArtifacts,
} from "../services/api";

export default function Trench3DPage() {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [stratigraphyData, setStratigraphyData] = useState(null);
  const [depthFilter, setDepthFilter] = useState(-10);
  const [selectedLayerCodes, setSelectedLayerCodes] = useState([]);
  const [is2DFallback, setIs2DFallback] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New layer form modal state
  const [showAddLayer, setShowAddLayer] = useState(false);
  const [newLayer, setNewLayer] = useState({
    layer_code: "Stratum III-B",
    historical_period: "Late Bronze Age",
    depth_top_meters: 2.0,
    depth_bottom_meters: 3.5,
    color_hex: "#8B4513",
  });

  // Default fallback mock data if server response is empty
  const defaultMockStratigraphy = {
    site_id: "SITE-ALPHA-01",
    site_name: "Alpha Trench",
    bounds: {
      min_x: 0,
      max_x: 10,
      min_y: 0,
      max_y: 10,
      min_depth: -8,
      max_depth: 0,
    },
    layers: [
      {
        id: "L1",
        layer_code: "Stratum I",
        historical_period: "Topsoil / Modern",
        depth_top_meters: 0.0,
        depth_bottom_meters: 0.8,
        color_hex: "#a3e635",
      },
      {
        id: "L2",
        layer_code: "Stratum II",
        historical_period: "Iron Age",
        depth_top_meters: 0.8,
        depth_bottom_meters: 2.0,
        color_hex: "#d97706",
      },
      {
        id: "L3",
        layer_code: "Stratum III-B",
        historical_period: "Bronze Age",
        depth_top_meters: 2.0,
        depth_bottom_meters: 4.5,
        color_hex: "#8b4513",
      },
      {
        id: "L4",
        layer_code: "Stratum IV",
        historical_period: "Neolithic",
        depth_top_meters: 4.5,
        depth_bottom_meters: 7.0,
        color_hex: "#451a03",
      },
    ],
    artifacts: [
      {
        id: "A1",
        artifact_code: "ART-2026-001",
        material: "Ceramic Amphora",
        context_layer: "Stratum III-B",
        x_offset_meters: 3.2,
        y_offset_meters: 4.8,
        z_depth_meters: 2.5,
      },
      {
        id: "A2",
        artifact_code: "ART-2026-002",
        material: "Bronze Dagger",
        context_layer: "Stratum II",
        x_offset_meters: 6.5,
        y_offset_meters: 2.1,
        z_depth_meters: 1.4,
      },
      {
        id: "A3",
        artifact_code: "ART-2026-003",
        material: "Stone Flint Tool",
        context_layer: "Stratum IV",
        x_offset_meters: 1.8,
        y_offset_meters: 8.0,
        z_depth_meters: 5.2,
      },
    ],
  };

  useEffect(() => {
    async function loadInitialData() {
      try {
        const sitesData = await getSites();
        if (sitesData && sitesData.length > 0) {
          setSites(sitesData);
          setSelectedSiteId(sitesData[0].id);
        } else {
          setSites([
            { id: "SITE-ALPHA-01", name: "Alpha Trench (SITE-ALP-01)" },
          ]);
          setSelectedSiteId("SITE-ALPHA-01");
        }
      } catch (e) {
        console.warn("Sites fetch failed, using fallback sites:", e);
        setSites([{ id: "SITE-ALPHA-01", name: "Alpha Trench (SITE-ALP-01)" }]);
        setSelectedSiteId("SITE-ALPHA-01");
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedSiteId) return;

    async function fetchStratigraphy() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSiteStratigraphy(selectedSiteId);
        if (data && data.layers) {
          setStratigraphyData(data);
          setSelectedLayerCodes(data.layers.map((l) => l.layer_code));
        } else {
          setStratigraphyData(defaultMockStratigraphy);
          setSelectedLayerCodes(
            defaultMockStratigraphy.layers.map((l) => l.layer_code),
          );
        }
      } catch (err) {
        console.warn(
          "Stratigraphy API fetch failed, using mock stratigraphy:",
          err,
        );
        setStratigraphyData(defaultMockStratigraphy);
        setSelectedLayerCodes(
          defaultMockStratigraphy.layers.map((l) => l.layer_code),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStratigraphy();
  }, [selectedSiteId]);

  const toggleLayerVisibility = (layerCode) => {
    setSelectedLayerCodes((prev) =>
      prev.includes(layerCode)
        ? prev.filter((c) => c !== layerCode)
        : [...prev, layerCode],
    );
  };

  const handleCreateLayer = async (e) => {
    e.preventDefault();
    if (!selectedSiteId) return;

    try {
      await addSiteStratigraphicLayer(selectedSiteId, newLayer);
      setShowAddLayer(false);
      // Refresh
      const updated = await getSiteStratigraphy(selectedSiteId);
      if (updated) {
        setStratigraphyData(updated);
        setSelectedLayerCodes(updated.layers.map((l) => l.layer_code));
      }
    } catch (err) {
      console.error("Create layer failed:", err);
      // Append locally
      setStratigraphyData((prev) => ({
        ...prev,
        layers: [
          ...(prev?.layers || []),
          { id: `L-${Date.now()}`, ...newLayer },
        ],
      }));
      setSelectedLayerCodes((prev) => [...prev, newLayer.layer_code]);
      setShowAddLayer(false);
    }
  };

  const activeStratigraphy = stratigraphyData || defaultMockStratigraphy;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-stone-200 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 flex items-center space-x-2">
            <Box className="w-6 h-6 text-amber-900" />
            <span>Interactive 3D Trench & Stratigraphic Layer Mapping</span>
          </h2>
          <p className="text-xs text-stone-500">
            WebGL 3D trench visualization rendering soil context layers and
            spatial 3D placement (X, Y, Z offsets)
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="px-3 py-1.5 border border-stone-300 rounded text-xs font-bold text-stone-800 focus:ring-1 focus:ring-amber-800"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                📍 {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddLayer(true)}
            className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded text-xs font-semibold shadow-sm flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Strata Layer</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: WebGL 3D Viewport */}
        <div className="lg:col-span-8">
          <TrenchVisualizer3D
            siteName={activeStratigraphy.site_name}
            bounds={activeStratigraphy.bounds}
            layers={activeStratigraphy.layers}
            artifacts={activeStratigraphy.artifacts}
            depthFilter={depthFilter}
            selectedLayerCodes={selectedLayerCodes}
            is2DFallback={is2DFallback}
            selectedArtifact={selectedArtifact}
            onSelectArtifact={setSelectedArtifact}
          />
        </div>

        {/* Right Column: Layer Controls HUD */}
        <div className="lg:col-span-4">
          <LayerControlsHUD
            layers={activeStratigraphy.layers}
            artifacts={activeStratigraphy.artifacts}
            depthFilter={depthFilter}
            setDepthFilter={setDepthFilter}
            selectedLayerCodes={selectedLayerCodes}
            toggleLayerVisibility={toggleLayerVisibility}
            is2DFallback={is2DFallback}
            setIs2DFallback={setIs2DFallback}
            selectedArtifact={selectedArtifact}
            setSelectedArtifact={setSelectedArtifact}
          />
        </div>
      </div>

      {/* Add Stratigraphic Layer Modal */}
      {showAddLayer && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200 pb-2">
              <Layers className="w-5 h-5 text-amber-800" />
              <span>Register Stratigraphic Context Layer</span>
            </h3>

            <form onSubmit={handleCreateLayer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block">
                  Layer Code
                </label>
                <input
                  type="text"
                  required
                  value={newLayer.layer_code}
                  onChange={(e) =>
                    setNewLayer({ ...newLayer, layer_code: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block">
                  Historical Period
                </label>
                <input
                  type="text"
                  required
                  value={newLayer.historical_period}
                  onChange={(e) =>
                    setNewLayer({
                      ...newLayer,
                      historical_period: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block">
                    Top Depth (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLayer.depth_top_meters}
                    onChange={(e) =>
                      setNewLayer({
                        ...newLayer,
                        depth_top_meters: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block">
                    Bottom Depth (m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newLayer.depth_bottom_meters}
                    onChange={(e) =>
                      setNewLayer({
                        ...newLayer,
                        depth_bottom_meters: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-1.5 border border-stone-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block">
                  Layer Display Color
                </label>
                <input
                  type="color"
                  value={newLayer.color_hex}
                  onChange={(e) =>
                    setNewLayer({ ...newLayer, color_hex: e.target.value })
                  }
                  className="w-full h-8 border border-stone-300 rounded cursor-pointer p-0.5"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddLayer(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold rounded shadow-sm"
                >
                  Save Layer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
