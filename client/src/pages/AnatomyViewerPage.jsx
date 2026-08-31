import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Layers,
  ArrowLeft,
  BookOpen,
  Activity,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import AnatomyCanvasViewer from "../components/viewer/AnatomyCanvasViewer";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { modulesApi, annotationsApi } from "../services/api";

export default function AnatomyViewerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlModuleId = searchParams.get("moduleId");

  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(urlModuleId || "");
  const [moduleData, setModuleData] = useState(null);
  const [annotationsBundle, setAnnotationsBundle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch available modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await modulesApi.listModules();
        setModules(data || []);
        if (!selectedModuleId && data && data.length > 0) {
          // Default to first anatomy module or first module
          const anatomyMod =
            data.find((m) => m.subject === "anatomy") || data[0];
          setSelectedModuleId(anatomyMod.id);
        }
      } catch (err) {
        // Continue with fallback
      }
    };
    fetchModules();
  }, []);

  // 2. Fetch specific module & annotations
  useEffect(() => {
    if (!selectedModuleId) return;

    const fetchModuleDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [modDetail, annotData] = await Promise.all([
          modulesApi.getModule(selectedModuleId).catch(() => null),
          annotationsApi.getAnnotations(selectedModuleId).catch(() => null),
        ]);

        setModuleData(modDetail);
        setAnnotationsBundle(annotData);
      } catch (err) {
        setError("Unable to load anatomical layers and hotspot annotations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleDetails();
    setSearchParams({ moduleId: selectedModuleId });
  }, [selectedModuleId]);

  // Extract layers and hotspots from annotations bundle or module detail
  const layers =
    annotationsBundle?.layers?.length > 0
      ? annotationsBundle.layers
      : moduleData?.image_layers || [
          {
            id: "lay-1",
            layer_name: "Skeletal Framework",
            layer_order: 1,
            image_url:
              "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200",
          },
          {
            id: "lay-2",
            layer_name: "Neural & Vascular Plexus",
            layer_order: 2,
            image_url:
              "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200",
          },
        ];

  const hotspots =
    annotationsBundle?.hotspots?.length > 0
      ? annotationsBundle.hotspots
      : [
          {
            id: "hs-1",
            layer_id: layers[0]?.id,
            x_percent: 55,
            y_percent: 52,
            title: "Radial Nerve",
            clinical_notes:
              "Originates from posterior cord (C5-T1). Descends through radial spiral groove.",
            clinical_significance:
              "Fracture of humeral shaft injures radial nerve, causing motor wrist drop and sensory loss.",
          },
          {
            id: "hs-2",
            layer_id: layers[0]?.id,
            x_percent: 42,
            y_percent: 68,
            title: "Median Nerve",
            clinical_notes:
              "Courses along medial bicipital groove into cubital fossa.",
            clinical_significance:
              "Compression at wrist in carpal tunnel leads to thenar atrophy and ape hand deformity.",
          },
        ];

  return (
    <div
      className="bg-[#f5f7fc] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
      data-node-id="1:112"
      data-name="Anatomy Canvas Viewer"
    >
      {/* Top Navigation & Module Selector Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-[#dee3ed] shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              Dashboard
            </Button>
          </Link>
          <div className="h-5 w-[1px] bg-gray-200 hidden sm:block" />
          <div>
            <h1 className="text-lg font-bold text-[#171f2e] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1466bf]" />
              Interactive Anatomy Dissection Canvas
            </h1>
            <p className="text-xs text-[#6b758a]">
              Multi-Layer Dissection & Hotspot Innervation Navigator
            </p>
          </div>
        </div>

        {/* Module Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="module-select"
            className="text-xs font-semibold text-[#6b758a] shrink-0"
          >
            Active Module:
          </label>
          <select
            id="module-select"
            value={selectedModuleId}
            onChange={(e) => setSelectedModuleId(e.target.value)}
            className="w-full sm:w-72 text-xs bg-gray-50 border border-[#dee3ed] rounded-xl px-3 py-2 font-medium text-[#171f2e] focus:outline-none focus:ring-2 focus:ring-[#1466bf]"
          >
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                [{m.subject?.toUpperCase()}] {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error state if any */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Anatomy Canvas Viewer Component */}
      <AnatomyCanvasViewer
        moduleData={moduleData}
        layers={layers}
        hotspots={hotspots}
        isLoading={isLoading}
      />

      {/* Bottom Switcher to Associated Digital Animation */}
      <div className="bg-white p-5 rounded-2xl border border-[#dee3ed] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#171f2e] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1466bf]" />
            Physiological Motion & Animation Correlate
          </h3>
          <p className="text-xs text-[#6b758a] mt-0.5">
            Continue learning by watching dynamic step-by-step physiological
            simulations with checkpoint quizzes.
          </p>
        </div>
        <Link to={`/animation?moduleId=${selectedModuleId}`}>
          <Button variant="primary" size="sm" icon={Activity}>
            Launch Animation Player
          </Button>
        </Link>
      </div>
    </div>
  );
}
