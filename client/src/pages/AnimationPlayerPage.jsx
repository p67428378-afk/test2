import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Layers,
  Award,
  BookOpen,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import AnimationPlayer from "../components/player/AnimationPlayer";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { modulesApi, quizzesApi, progressApi } from "../services/api";

export default function AnimationPlayerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlModuleId = searchParams.get("moduleId");

  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(urlModuleId || "");
  const [moduleData, setModuleData] = useState(null);
  const [checkpoints, setCheckpoints] = useState([]);
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch available modules list
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await modulesApi.listModules();
        setModules(data || []);
        if (!selectedModuleId && data && data.length > 0) {
          // Default to physiology module or first module
          const physMod =
            data.find((m) => m.subject === "physiology") || data[0];
          setSelectedModuleId(physMod.id);
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchModules();
  }, []);

  // 2. Fetch specific module, checkpoints, and user progress
  useEffect(() => {
    if (!selectedModuleId) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [modDetail, quizList, prog] = await Promise.all([
          modulesApi.getModule(selectedModuleId).catch(() => null),
          quizzesApi.getQuizzes(selectedModuleId).catch(() => []),
          progressApi.getModuleProgress(selectedModuleId).catch(() => null),
        ]);

        setModuleData(modDetail);
        setCheckpoints(quizList || modDetail?.checkpoints || []);
        setProgressData(prog);
      } catch (err) {
        setError("Unable to load digital animation player checkpoints.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    setSearchParams({ moduleId: selectedModuleId });
  }, [selectedModuleId]);

  const handleCheckpointSuccess = async (checkpointId, passed) => {
    // Refresh progress state
    try {
      const updated = await progressApi.getModuleProgress(selectedModuleId);
      setProgressData(updated);
    } catch {
      // Ignore
    }
  };

  const defaultCheckpoints = [
    {
      id: "cp-1",
      timestamp_seconds: 75,
      question_text:
        "What clinical and physiological event marks the exact onset of ventricular systole?",
      options: [
        "Closure of atrioventricular (AV) valves (First Heart Sound, S1)",
        "Opening of the aortic semilunar valve",
        "Closure of aortic and pulmonary valves (Second Heart Sound, S2)",
        "Isovolumetric ventricular relaxation",
      ],
      correct_option: 0,
    },
    {
      id: "cp-2",
      timestamp_seconds: 120,
      question_text:
        "During which phase of the cardiac cycle are all four cardiac valves closed while ventricular pressure rises steeply?",
      options: [
        "Ventricular diastasis",
        "Isovolumetric contraction phase",
        "Rapid ventricular ejection phase",
        "Reduced ventricular ejection phase",
      ],
      correct_option: 1,
    },
  ];

  const activeCheckpoints =
    checkpoints && checkpoints.length > 0 ? checkpoints : defaultCheckpoints;

  return (
    <div
      className="bg-[#f5f7fc] min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto"
      data-node-id="1:194"
      data-name="Digital Animation Player & Quiz Checkpoint"
    >
      {/* Top Header & Switcher */}
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
              <Activity className="w-5 h-5 text-[#1466bf]" />
              Physiological Digital Animation & Quiz Player
            </h1>
            <p className="text-xs text-[#6b758a]">
              Interactive Simulation with Automated Assessment Checkpoints
            </p>
          </div>
        </div>

        {/* Module Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="anim-module-select"
            className="text-xs font-semibold text-[#6b758a] shrink-0"
          >
            Active Simulation:
          </label>
          <select
            id="anim-module-select"
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

      {/* Animation Player Component */}
      <AnimationPlayer
        moduleData={moduleData}
        checkpoints={activeCheckpoints}
        onCheckpointComplete={handleCheckpointSuccess}
      />

      {/* Bottom Switcher to Anatomy Dissection */}
      <div className="bg-white p-5 rounded-2xl border border-[#dee3ed] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#171f2e] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1466bf]" />
            Anatomical Structure & Dissection Canvas Correlate
          </h3>
          <p className="text-xs text-[#6b758a] mt-0.5">
            Switch to the high-resolution anatomical layer viewer to inspect
            structural innervation and clinical pearls.
          </p>
        </div>
        <Link to={`/anatomy?moduleId=${selectedModuleId}`}>
          <Button variant="secondary" size="sm" icon={Layers}>
            Open Anatomy Viewer
          </Button>
        </Link>
      </div>
    </div>
  );
}
