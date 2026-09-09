import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GuidedPracticePlayer from "../components/GuidedPracticePlayer";
import { poseService, routineService } from "../services/api";

export default function RoutineBuilderPage() {
  const { id } = useParams(); // if editing routine
  const navigate = useNavigate();

  const [routineName, setRoutineName] = useState("Morning Flow Sequence");
  const [description, setDescription] = useState(
    "15-minute invigorating morning sequence",
  );
  const [selectedPoses, setSelectedPoses] = useState([]); // Array of { pose_id, hold_duration_seconds, transition_notes, pose }
  const [availablePoses, setAvailablePoses] = useState([]);

  const [loadingPoses, setLoadingPoses] = useState(true);
  const [savingRoutine, setSavingRoutine] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const [showPlayer, setShowPlayer] = useState(false);
  const [activeRoutineForPlayer, setActiveRoutineForPlayer] = useState(null);

  // Fetch available poses for picker
  useEffect(() => {
    async function loadData() {
      try {
        setLoadingPoses(true);
        const poses = await poseService.getPoses({ limit: 100 });
        setAvailablePoses(poses || []);

        if (id) {
          const routineData = await routineService.getRoutine(id);
          if (routineData) {
            setRoutineName(routineData.name || "");
            setDescription(routineData.description || "");
            if (routineData.poses) {
              setSelectedPoses(
                routineData.poses.map((p, idx) => ({
                  pose_id: p.pose_id || p.pose?.id,
                  hold_duration_seconds: p.hold_duration_seconds || 30,
                  transition_notes: p.transition_notes || "",
                  sequence_order: idx + 1,
                  pose: p.pose,
                })),
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to load builder data:", err);
      } finally {
        setLoadingPoses(false);
      }
    }
    loadData();
  }, [id]);

  // Calculate total duration
  const totalDurationSeconds = selectedPoses.reduce(
    (acc, curr) => acc + (Number(curr.hold_duration_seconds) || 0),
    0,
  );

  const formatTotalTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const handleAddPoseToRoutine = (pose) => {
    // Edge case duplicate check
    const lastPose = selectedPoses[selectedPoses.length - 1];
    if (lastPose && lastPose.pose_id === pose.id) {
      setDuplicateWarning(
        `"${pose.english_name}" is already the previous pose in sequence. Duplicate added intentionally?`,
      );
    } else {
      setDuplicateWarning(null);
    }

    const newItem = {
      pose_id: pose.id,
      hold_duration_seconds: 30,
      transition_notes: "",
      sequence_order: selectedPoses.length + 1,
      pose: pose,
    };
    setSelectedPoses((prev) => [...prev, newItem]);
  };

  const handleRemovePose = (index) => {
    setSelectedPoses((prev) => prev.filter((_, idx) => idx !== index));
    setDuplicateWarning(null);
  };

  const handleMovePose = (index, direction) => {
    if (
      (direction === -1 && index === 0) ||
      (direction === 1 && index === selectedPoses.length - 1)
    ) {
      return;
    }
    const updated = [...selectedPoses];
    const targetIdx = index + direction;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSelectedPoses(updated);
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...selectedPoses];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedPoses(updated);
  };

  const handleSaveRoutine = async () => {
    if (!routineName.trim()) {
      alert("Please enter a routine title.");
      return;
    }
    if (selectedPoses.length === 0) {
      alert("Empty routines cannot be saved. Please add at least 1 pose.");
      return;
    }

    try {
      setSavingRoutine(true);
      const payload = {
        name: routineName.trim(),
        description: description.trim(),
        poses: selectedPoses.map((item, idx) => ({
          pose_id: item.pose_id,
          sequence_order: idx + 1,
          hold_duration_seconds: Number(item.hold_duration_seconds) || 30,
          transition_notes: item.transition_notes || "",
        })),
      };

      if (id) {
        await routineService.updateRoutine(id, payload);
        alert("Routine updated successfully!");
      } else {
        await routineService.createRoutine(payload);
        alert("Routine saved successfully!");
      }
      navigate("/routines");
    } catch (err) {
      console.error("Failed to save routine:", err);
      alert("Failed to save routine. Check requirements.");
    } finally {
      setSavingRoutine(false);
    }
  };

  const handleExportPDF = async () => {
    if (!id) {
      alert("Please save the routine before exporting PDF.");
      return;
    }
    try {
      const blob = await routineService.exportRoutine(id, "pdf");
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${routineName.replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Export PDF guide failed.");
    }
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(
        {
          name: routineName,
          description,
          total_duration_seconds: totalDurationSeconds,
          poses: selectedPoses,
        },
        null,
        2,
      ),
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `${routineName.replace(/\s+/g, "_")}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleStartPractice = () => {
    if (selectedPoses.length === 0) {
      alert("Add poses to routine before starting practice.");
      return;
    }
    setActiveRoutineForPlayer({
      id: id || "temp-id",
      name: routineName,
      description,
      poses: selectedPoses,
    });
    setShowPlayer(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-6 flex-1 w-full">
        {/* Header Action Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Routine Title (e.g. Morning Flow Sequence)..."
              className="text-2xl font-bold font-serif text-teal-950 border-b border-transparent hover:border-slate-300 focus:border-teal-600 focus:outline-none w-full bg-transparent"
            />
            <div className="flex items-center gap-4 mt-1">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description or focus notes..."
                className="text-xs text-slate-500 w-full bg-transparent focus:outline-none"
              />
              <span className="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2.5 py-1 rounded-full border border-teal-200 whitespace-nowrap">
                {formatTotalTime(totalDurationSeconds)} • {selectedPoses.length}{" "}
                Poses
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={handleExportPDF}
              className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-3.5 py-2 rounded-lg text-xs"
            >
              📄 Export PDF
            </button>
            <button
              onClick={handleExportJSON}
              className="border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-3.5 py-2 rounded-lg text-xs"
            >
              📥 Export JSON
            </button>
            <button
              onClick={handleStartPractice}
              className="bg-teal-800 hover:bg-teal-900 text-white font-medium px-4 py-2 rounded-lg shadow-sm text-xs"
            >
              ▶ Start Practice
            </button>
            <button
              onClick={handleSaveRoutine}
              disabled={savingRoutine}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg shadow-sm text-xs"
            >
              {savingRoutine ? "Saving..." : "Save Routine"}
            </button>
          </div>
        </header>

        {duplicateWarning && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-xl text-xs flex justify-between items-center">
            <span>⚠️ {duplicateWarning}</span>
            <button
              onClick={() => setDuplicateWarning(null)}
              className="font-bold underline ml-2 text-amber-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 2-Column Sequence Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sequence Builder (8 cols) */}
          <section className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-serif text-teal-950 flex justify-between items-center">
              <span>Sequence Order ({selectedPoses.length} Poses)</span>
              {selectedPoses.length === 0 && (
                <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Empty routine
                </span>
              )}
            </h3>

            {selectedPoses.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center space-y-2">
                <span className="text-4xl" role="img" aria-label="add">
                  ➕
                </span>
                <p className="text-sm font-bold text-slate-700">
                  Your Routine Sequence is Empty
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click "+ Add to Routine" on any pose in the Library Drawer to
                  build your sequence.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedPoses.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-teal-900 text-white font-mono text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm font-serif">
                          {item.pose?.english_name || "Yoga Pose"}
                        </h4>
                        {item.pose?.sanskrit_name && (
                          <p className="text-[11px] italic text-teal-700">
                            {item.pose.sanskrit_name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Hold Duration Stepper */}
                      <div className="flex items-center gap-1.5 bg-white border rounded-lg p-1 text-xs">
                        <span className="text-slate-500 font-semibold px-1">
                          Hold:
                        </span>
                        <input
                          type="number"
                          min="5"
                          max="600"
                          step="5"
                          value={item.hold_duration_seconds}
                          onChange={(e) =>
                            handleUpdateItem(
                              idx,
                              "hold_duration_seconds",
                              e.target.value,
                            )
                          }
                          className="w-12 text-center font-mono font-bold focus:outline-none"
                        />
                        <span className="text-slate-400">sec</span>
                      </div>

                      {/* Transition Note */}
                      <input
                        type="text"
                        placeholder="Transition note..."
                        value={item.transition_notes || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "transition_notes",
                            e.target.value,
                          )
                        }
                        className="text-xs p-1.5 border rounded-lg bg-white w-28 focus:outline-none"
                      />

                      {/* Move & Remove Controls */}
                      <div className="flex gap-1 text-xs">
                        <button
                          onClick={() => handleMovePose(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-slate-500 hover:text-teal-800 disabled:opacity-30"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMovePose(idx, 1)}
                          disabled={idx === selectedPoses.length - 1}
                          className="p-1 text-slate-500 hover:text-teal-800 disabled:opacity-30"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => handleRemovePose(idx)}
                          className="p-1 text-red-500 hover:text-red-700 font-bold"
                          title="Remove Pose"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Column: Pose Library Drawer (5 cols) */}
          <section className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 max-h-[750px] overflow-y-auto">
            <h3 className="text-lg font-bold font-serif text-teal-950">
              Pose Library Drawer
            </h3>
            <p className="text-xs text-slate-500">
              Select poses from catalog to append to sequence.
            </p>

            {loadingPoses ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Loading library...
              </div>
            ) : (
              <div className="space-y-2.5">
                {availablePoses.map((pose) => (
                  <div
                    key={pose.id}
                    className="p-3 border rounded-xl bg-slate-50 hover:bg-teal-50/40 border-slate-200 flex justify-between items-center transition-colors"
                  >
                    <div>
                      <div className="flex gap-1.5 mb-0.5">
                        <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-semibold">
                          {pose.category || "Standing"}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                          {pose.difficulty || "Beginner"}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 font-serif">
                        {pose.english_name}
                      </h4>
                      {pose.sanskrit_name && (
                        <p className="text-[10px] italic text-teal-700">
                          {pose.sanskrit_name}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddPoseToRoutine(pose)}
                      className="px-2.5 py-1 bg-teal-800 hover:bg-teal-900 text-white rounded text-xs font-semibold shadow-2xs"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Guided Practice Player Modal */}
      {showPlayer && activeRoutineForPlayer && (
        <GuidedPracticePlayer
          routine={activeRoutineForPlayer}
          onClose={() => setShowPlayer(false)}
          onFinish={() => {
            setShowPlayer(false);
            navigate("/practice-history");
          }}
        />
      )}
    </div>
  );
}
