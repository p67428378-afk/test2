import React, { useState, useEffect, useRef } from "react";
import { practiceService } from "../services/api";

export default function GuidedPracticePlayer({ routine, onClose, onFinish }) {
  const poses = routine?.poses || [];
  const [currentPoseIdx, setCurrentPoseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    poses[0]?.hold_duration_seconds || 30,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logging, setLogging] = useState(false);

  const audioCtxRef = useRef(null);

  const currentRoutinePose = poses[currentPoseIdx];
  const currentPose = currentRoutinePose?.pose || currentRoutinePose;
  const nextRoutinePose = poses[currentPoseIdx + 1];
  const nextPose = nextRoutinePose?.pose || nextRoutinePose;

  // Web Audio Chime Sound
  const playChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 chime note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Web Audio chime not supported or blocked:", e);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (isPaused || isCompleted || poses.length === 0) return;

    const timer = setInterval(() => {
      setTotalElapsed((prev) => prev + 1);
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playChime();
          if (currentPoseIdx < poses.length - 1) {
            setCompletedCount((c) => c + 1);
            const nextIdx = currentPoseIdx + 1;
            setCurrentPoseIdx(nextIdx);
            return poses[nextIdx]?.hold_duration_seconds || 30;
          } else {
            setCompletedCount((c) => c + 1);
            setIsCompleted(true);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isCompleted, currentPoseIdx, poses]);

  const handleSkip = () => {
    playChime();
    if (currentPoseIdx < poses.length - 1) {
      setCompletedCount((c) => c + 1);
      const nextIdx = currentPoseIdx + 1;
      setCurrentPoseIdx(nextIdx);
      setTimeLeft(poses[nextIdx]?.hold_duration_seconds || 30);
    } else {
      setCompletedCount((c) => c + 1);
      setIsCompleted(true);
    }
  };

  const handleFinishAndSave = async () => {
    try {
      setLogging(true);
      await practiceService.logPracticeSession({
        routine_id: routine.id,
        completed_duration_seconds: totalElapsed,
        poses_completed: completedCount || poses.length,
        notes: `Completed practice for routine: ${routine.name}`,
        user_id: "default_user",
      });
      if (onFinish) onFinish();
      onClose();
    } catch (err) {
      console.error("Failed to log practice session:", err);
      if (onFinish) onFinish();
      onClose();
    } finally {
      setLogging(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!routine || poses.length === 0) {
    return (
      <div className="fixed inset-0 bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center space-y-4 z-50">
        <h2 className="text-xl font-bold">No Poses in Routine</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-950 text-slate-100 p-6 flex flex-col justify-between z-50 overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 max-w-4xl mx-auto w-full">
        <div>
          <h2 className="text-xl font-bold font-serif text-teal-400">
            {routine.name || "Guided Yoga Practice"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pose {currentPoseIdx + 1} of {poses.length} • Elapsed:{" "}
            {formatTime(totalElapsed)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-teal-950 text-teal-300 border border-teal-800 px-3 py-1 rounded-full text-xs font-mono">
            🔔 Web Audio Chime Active
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl px-2"
            title="Exit Player"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main Runner Body */}
      {isCompleted ? (
        <main className="flex-1 flex flex-col items-center justify-center my-8 text-center space-y-6 max-w-lg mx-auto">
          <span className="text-6xl" role="img" aria-label="party">
            🎉
          </span>
          <h3 className="text-3xl font-bold font-serif text-teal-300">
            Practice Complete!
          </h3>
          <p className="text-slate-300 text-sm">
            Namaste! You finished <strong>{routine.name}</strong>. Great job on
            maintaining alignment and breath flow.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-full text-left text-sm space-y-1">
            <p className="text-slate-400">
              Total Time:{" "}
              <span className="text-white font-bold font-mono">
                {formatTime(totalElapsed)}
              </span>
            </p>
            <p className="text-slate-400">
              Poses Completed:{" "}
              <span className="text-white font-bold font-mono">
                {completedCount} / {poses.length}
              </span>
            </p>
          </div>
          <button
            onClick={handleFinishAndSave}
            disabled={logging}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            {logging ? "Saving Session Log..." : "Save Session & Complete"}
          </button>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center my-8 text-center space-y-6 max-w-2xl mx-auto">
          <div>
            <span className="bg-teal-900/60 text-teal-300 text-xs px-3 py-1 rounded-full font-semibold border border-teal-700/50">
              {currentPose?.category || "Standing"} •{" "}
              {currentPose?.difficulty || "Beginner"}
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-serif text-white mt-2">
              {currentPose?.english_name || "Yoga Pose"}
            </h3>
            {currentPose?.sanskrit_name && (
              <p className="text-sm italic text-teal-300 mt-1">
                {currentPose.sanskrit_name}
              </p>
            )}
          </div>

          {/* Countdown Display Circle */}
          <div className="w-48 h-48 rounded-full border-4 border-teal-500/40 flex flex-col items-center justify-center text-4xl font-bold font-mono text-teal-300 bg-slate-900/80 shadow-2xl relative">
            <span>{formatTime(timeLeft)}</span>
            <span className="text-xs font-sans text-slate-400 font-normal mt-1">
              {isPaused ? "PAUSED" : "HOLD DURATION"}
            </span>
          </div>

          {/* Alignment / Transition Cue */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-slate-300 max-w-lg text-sm text-left space-y-1 shadow-md">
            {currentRoutinePose?.transition_notes ? (
              <p className="text-amber-300 text-xs font-semibold">
                Note: {currentRoutinePose.transition_notes}
              </p>
            ) : null}
            <p className="italic">
              "
              {currentPose?.alignment_cues ||
                currentPose?.breath_instructions ||
                "Maintain steady breathing and active posture grounding."}
              "
            </p>
          </div>

          {/* Next Pose Preview */}
          {nextPose && (
            <div className="text-xs text-slate-400 bg-slate-900/40 px-4 py-2 rounded-lg border border-slate-800/60">
              Next Up:{" "}
              <span className="text-teal-300 font-semibold">
                {nextPose.english_name}
              </span>{" "}
              ({nextRoutinePose?.hold_duration_seconds || 30}s)
            </div>
          )}
        </main>
      )}

      {/* Footer Controls */}
      {!isCompleted && (
        <footer className="flex justify-center gap-4 border-t border-slate-800 pt-4 max-w-lg mx-auto w-full">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
          <button
            onClick={handleSkip}
            className="border border-slate-700 hover:bg-slate-800 text-slate-300 px-5 py-3 rounded-xl transition-all"
          >
            ⏭ Skip Pose
          </button>
          <button
            onClick={onClose}
            className="border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-4 py-3 rounded-xl transition-all"
          >
            Exit
          </button>
        </footer>
      )}
    </div>
  );
}
