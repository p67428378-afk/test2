import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  getPoses,
  getRoutineById,
  createRoutine,
  updateRoutine,
} from "../api/client";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function RoutineBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routineId } = useParams();

  const [routineName, setRoutineName] = useState("Morning Energizer Flow");
  const [description, setDescription] = useState(
    "Invigorating sequence designed for hip mobility and spine wake-up.",
  );
  const [items, setItems] = useState([]);

  // Catalog for adding poses
  const [catalogPoses, setCatalogPoses] = useState([]);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Status & Warnings
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch catalog Poses
  useEffect(() => {
    const fetchCatalog = async () => {
      setCatalogLoading(true);
      try {
        const data = await getPoses({ query: catalogSearch });
        setCatalogPoses(data || []);
      } catch (err) {
        console.error("Error fetching poses for builder:", err);
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchCatalog();
  }, [catalogSearch]);

  // Handle Edit Mode or Incoming pose from catalog
  useEffect(() => {
    if (routineId) {
      const loadRoutine = async () => {
        try {
          const existing = await getRoutineById(routineId);
          if (existing) {
            setRoutineName(existing.name || "");
            setDescription(existing.description || "");
            const loadedItems = (existing.items || []).map((it, idx) => ({
              pose_id: it.pose_id,
              pose: it.pose,
              sequence_order: it.sequence_order || idx + 1,
              hold_duration_seconds: it.hold_duration_seconds || 30,
              transition_notes: it.transition_notes || "",
            }));
            setItems(loadedItems);
          }
        } catch (err) {
          console.error("Error loading routine for edit:", err);
        }
      };
      loadRoutine();
    } else if (location.state?.addPose) {
      const poseToAdd = location.state.addPose;
      handleAddPoseToRoutine(poseToAdd);
    }
  }, [routineId, location.state]);

  // Calculate Total Duration
  const totalSeconds = items.reduce(
    (acc, curr) => acc + (parseInt(curr.hold_duration_seconds) || 0),
    0,
  );
  const totalMinutes = Math.ceil(totalSeconds / 60);

  // Add Pose to Routine Sequence
  const handleAddPoseToRoutine = (pose) => {
    setValidationError("");
    setDuplicateWarning(null);

    // Check if immediate previous pose is the same (duplicate warning edge case)
    if (items.length > 0 && items[items.length - 1].pose_id === pose.id) {
      setDuplicateWarning(
        `Note: Consecutive duplicate pose "${pose.english_name}" added. Duplicate poses in sequence are allowed for intentional repetition.`,
      );
    }

    const newItem = {
      pose_id: pose.id,
      pose: {
        id: pose.id,
        english_name: pose.english_name,
        sanskrit_name: pose.sanskrit_name,
        category: pose.category,
        difficulty: pose.difficulty,
        image_url: pose.image_url,
      },
      sequence_order: items.length + 1,
      hold_duration_seconds: 30,
      transition_notes: "",
    };

    setItems([...items, newItem]);
  };

  // Remove Item
  const handleRemoveItem = (index) => {
    const updated = items
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({
        ...item,
        sequence_order: idx + 1,
      }));
    setItems(updated);
  };

  // Reorder Item (Move Up/Down)
  const handleMoveItem = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;

    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate sequence_order
    const reordered = newItems.map((item, idx) => ({
      ...item,
      sequence_order: idx + 1,
    }));

    setItems(reordered);
  };

  // Update Duration or Notes
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Save Routine
  const handleSaveRoutine = async () => {
    setValidationError("");
    setSuccessMsg("");

    // Edge Case: Empty routines cannot be saved
    if (items.length === 0) {
      setValidationError(
        "Empty routines cannot be saved. Please add at least one pose from the library.",
      );
      return;
    }

    if (!routineName.trim()) {
      setValidationError("Please enter a routine name.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: routineName.trim(),
        description: description.trim(),
        items: items.map((item, idx) => ({
          pose_id: item.pose_id,
          sequence_order: idx + 1,
          hold_duration_seconds: parseInt(item.hold_duration_seconds) || 30,
          transition_notes: item.transition_notes || "",
        })),
      };

      if (routineId) {
        await updateRoutine(routineId, payload);
        setSuccessMsg("Routine updated successfully!");
      } else {
        await createRoutine(payload);
        setSuccessMsg("Routine created successfully!");
      }

      setTimeout(() => {
        navigate("/routines");
      }, 1000);
    } catch (err) {
      console.error("Failed to save routine:", err);
      // NO FAKE SUCCESS -- surface the error explicitly
      setValidationError(
        "Failed to save routine to server. Please verify your connection or pose items.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <header className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Routine Title (e.g. Morning Flow)..."
            className="text-2xl sm:text-3xl font-bold font-serif text-teal-950 border-b border-slate-200 focus:border-teal-700 focus:outline-none w-full bg-transparent pb-1"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional routine description or goal..."
            className="text-sm text-slate-500 w-full focus:outline-none bg-transparent"
          />
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 pt-1">
            <span className="flex items-center gap-1 bg-teal-50 text-teal-900 px-2.5 py-1 rounded-md border border-teal-100">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>
                {totalMinutes} min ({totalSeconds}s total)
              </span>
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
              {items.length} Poses
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/routines")}
            className="px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors flex-1 md:flex-initial text-center"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveRoutine}
            disabled={saving}
            className="bg-teal-800 hover:bg-teal-900 text-white font-medium text-sm px-6 py-2.5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 flex-1 md:flex-initial"
          >
            <Save className="w-4 h-4" />
            <span>
              {saving
                ? "Saving..."
                : routineId
                  ? "Update Routine"
                  : "Save Routine"}
            </span>
          </button>
        </div>
      </header>

      {/* Validation or Duplicate Banner */}
      {validationError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {duplicateWarning && (
        <div className="bg-sky-50 border border-sky-200 text-sky-800 text-xs p-3.5 rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{duplicateWarning}</span>
          </div>
          <button
            onClick={() => setDuplicateWarning(null)}
            className="text-sky-600 hover:text-sky-900 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pose Library Selector Drawer */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 h-fit">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-800" />
              <span>Pose Library Selector</span>
            </h3>
            <span className="text-xs text-slate-400">
              {catalogPoses.length} available
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search catalog to add..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Catalog list items */}
          {catalogLoading ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Loading poses...
            </p>
          ) : catalogPoses.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No poses found in library.
            </p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {catalogPoses.map((pose) => (
                <div
                  key={pose.id}
                  className="flex justify-between items-center p-3 border border-slate-200/80 rounded-xl hover:bg-teal-50/60 transition-colors group cursor-pointer"
                  onClick={() => handleAddPoseToRoutine(pose)}
                >
                  <div className="pr-2">
                    <p className="font-semibold text-xs text-slate-900 group-hover:text-teal-950">
                      {pose.english_name}
                    </p>
                    <p className="text-[11px] italic text-teal-700 font-serif">
                      {pose.sanskrit_name} &bull; {pose.difficulty}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddPoseToRoutine(pose);
                    }}
                    className="bg-teal-100 group-hover:bg-teal-800 group-hover:text-white text-teal-800 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Routine Sequence List Builder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">
              Ordered Routine Sequence ({items.length} Poses)
            </h3>
            <span className="text-xs text-slate-500">
              Drag or use controls to set sequence & hold times
            </span>
          </div>

          {items.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center space-y-3 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">
                Your sequence is currently empty
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select poses from the library on the left to add them to your
                custom yoga flow sequence.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  {/* Sequence # & Name */}
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-7 h-7 bg-teal-800 text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {item.pose?.english_name || "Yoga Pose"}
                      </h4>
                      <p className="text-xs text-teal-700 italic font-serif">
                        {item.pose?.sanskrit_name} &bull;{" "}
                        {item.pose?.category || "Pose"}
                      </p>
                    </div>
                  </div>

                  {/* Hold Duration & Transition Notes */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-600 font-medium">Hold:</span>
                      <input
                        type="number"
                        min="5"
                        max="600"
                        step="5"
                        value={item.hold_duration_seconds}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "hold_duration_seconds",
                            e.target.value,
                          )
                        }
                        className="w-14 text-center font-bold text-teal-900 focus:outline-none border-b border-teal-300"
                      />
                      <span className="text-slate-500">sec</span>
                    </div>

                    <input
                      type="text"
                      value={item.transition_notes || ""}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "transition_notes",
                          e.target.value,
                        )
                      }
                      placeholder="Transition notes (e.g. Deep breaths)..."
                      className="text-xs p-2 border border-slate-200 rounded-lg bg-white flex-1 sm:w-48 focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />

                    {/* Order & Remove Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveItem(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveItem(index, "down")}
                        disabled={index === items.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 ml-1"
                        title="Remove Pose"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
