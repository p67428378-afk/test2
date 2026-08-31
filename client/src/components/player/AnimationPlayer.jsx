import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import Badge from "../common/Badge";
import Button from "../common/Button";
import QuizOverlayModal from "../quiz/QuizOverlayModal";

export default function AnimationPlayer({
  moduleData,
  checkpoints = [],
  onCheckpointComplete,
  videoSrc,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // Default 3 min fallback if metadata pending
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [completedCheckpointIds, setCompletedCheckpointIds] = useState([]);
  const [triggeredCheckpointIds, setTriggeredCheckpointIds] = useState([]);

  // Sort checkpoints by timestamp
  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) =>
      (a.timestamp_seconds ?? a.checkpoint_time_seconds ?? 0) -
      (b.timestamp_seconds ?? b.checkpoint_time_seconds ?? 0),
  );

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {
        // Autoplay policy or error
      });
      setIsPlaying(true);
    }
  };

  // Video Time Update Monitor for Checkpoints
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Check if we hit an untriggered checkpoint within 1.0s window
    for (const cp of sortedCheckpoints) {
      const cpTime = cp.timestamp_seconds ?? cp.checkpoint_time_seconds ?? 0;
      if (
        Math.abs(time - cpTime) < 0.75 &&
        !triggeredCheckpointIds.includes(cp.id) &&
        !completedCheckpointIds.includes(cp.id)
      ) {
        // Auto-pause and open checkpoint quiz
        videoRef.current.pause();
        setIsPlaying(false);
        setActiveCheckpoint(cp);
        setTriggeredCheckpointIds((prev) => [...prev, cp.id]);
        break;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  // Speed changer
  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Frame scrubbing (5 seconds back / forward)
  const scrubTime = (deltaSeconds) => {
    if (!videoRef.current) return;
    const newTime = Math.max(
      0,
      Math.min(videoRef.current.currentTime + deltaSeconds, duration),
    );
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek bar
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
    setCurrentTime(seekTime);
  };

  // Checkpoint Quiz Completion Handler
  const handleQuizComplete = (checkpointId, passed) => {
    setActiveCheckpoint(null);
    setCompletedCheckpointIds((prev) =>
      prev.includes(checkpointId) ? prev : [...prev, checkpointId],
    );

    if (onCheckpointComplete) {
      onCheckpointComplete(checkpointId, passed);
    }

    // Auto-resume playback after passing checkpoint
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Sample or live animation URL
  const activeVideoUrl =
    videoSrc ||
    moduleData?.animation_url ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
      {/* Video Canvas & Controls */}
      <div className="flex-1 w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
        {/* Video Surface */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={activeVideoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            muted={isMuted}
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Overlay Play/Pause Button on Hover / Pause */}
          {!isPlaying && !activeCheckpoint && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#1466bf]/80 hover:bg-[#1466bf] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-10"
              aria-label="Play Video"
            >
              <Play className="w-8 h-8 ml-1" />
            </button>
          )}

          {/* Live Checkpoint Marker Badges on Timeline Header */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <Badge variant="physiology" size="sm">
              Cardiac & Cellular Animation
            </Badge>
          </div>
        </div>

        {/* Custom Timeline & Interactive Controls */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white space-y-4">
          {/* Progress Timeline with Checkpoint Pins */}
          <div className="relative w-full pt-2">
            {/* Checkpoint Indicators on Slider Track */}
            <div className="absolute top-0 left-0 right-0 h-4 pointer-events-none">
              {sortedCheckpoints.map((cp) => {
                const cpTime =
                  cp.timestamp_seconds ?? cp.checkpoint_time_seconds ?? 0;
                const posPercent = (cpTime / (duration || 180)) * 100;
                const isCompleted = completedCheckpointIds.includes(cp.id);

                return (
                  <div
                    key={cp.id}
                    style={{ left: `${Math.min(posPercent, 98)}%` }}
                    className="absolute -top-1 -translate-x-1/2 flex flex-col items-center group pointer-events-auto cursor-pointer"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = cpTime;
                        setCurrentTime(cpTime);
                      }
                    }}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shadow ${
                        isCompleted ? "bg-[#149e52]" : "bg-[#eb941a]"
                      }`}
                    />
                    <span className="hidden group-hover:block absolute bottom-full mb-1 text-[10px] bg-black/90 text-white px-2 py-0.5 rounded whitespace-nowrap border border-slate-700">
                      Quiz: {formatTime(cpTime)} {isCompleted ? "✓" : ""}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max={duration || 180}
              step="0.5"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#1466bf]"
              aria-label="Timeline seek"
            />
          </div>

          {/* Controls Bottom Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            {/* Playback Transport Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={() => scrubTime(-5)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Rewind 5s"
                aria-label="Rewind 5s"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrubTime(5)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Forward 5s"
                aria-label="Forward 5s"
              >
                <FastForward className="w-4 h-4" />
              </button>

              {/* Time Display */}
              <div className="font-mono text-slate-300 ml-2">
                <span>{formatTime(currentTime)}</span>
                <span className="text-slate-600 mx-1">/</span>
                <span className="text-slate-500">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Speed & Audio Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Playback Speed selector */}
              <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => changeSpeed(spd)}
                    className={`px-2 py-1 rounded text-xs font-semibold transition ${
                      playbackSpeed === spd
                        ? "bg-[#1466bf] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Timeline Checkpoint Registry */}
      <div className="w-full lg:w-[360px] flex flex-col gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#dee3ed] shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#dee3ed]">
            <h3 className="font-bold text-sm text-[#171f2e] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#1466bf]" /> Checkpoint Quizzes
            </h3>
            <span className="text-xs font-semibold text-[#149e52]">
              {completedCheckpointIds.length}/{sortedCheckpoints.length} Passed
            </span>
          </div>

          <div className="space-y-3">
            {sortedCheckpoints.map((cp, idx) => {
              const cpTime =
                cp.timestamp_seconds ?? cp.checkpoint_time_seconds ?? 0;
              const isCompleted = completedCheckpointIds.includes(cp.id);

              return (
                <div
                  key={cp.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                      : "bg-gray-50/70 border-gray-200 text-[#171f2e]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#149e52] shrink-0" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-[#eb941a] shrink-0" />
                      )}
                      Checkpoint #{idx + 1}
                    </span>
                    <Badge
                      variant={isCompleted ? "success" : "warning"}
                      size="xs"
                    >
                      {formatTime(cpTime)}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#6b758a] line-clamp-2 mb-2">
                    {cp.question_text}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = cpTime;
                          setCurrentTime(cpTime);
                        }
                      }}
                      className="text-[11px] font-semibold text-[#1466bf] hover:underline"
                    >
                      Jump to {formatTime(cpTime)}
                    </button>

                    <Button
                      size="sm"
                      variant={isCompleted ? "secondary" : "primary"}
                      onClick={() => setActiveCheckpoint(cp)}
                    >
                      {isCompleted ? "Review Quiz" : "Take Quiz"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Yield Physiology Summary */}
        <div className="bg-white p-5 rounded-2xl border border-[#dee3ed] shadow-sm">
          <h4 className="text-xs font-bold text-[#1466bf] uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#149e52]" /> Key Learning
            Objectives
          </h4>
          <ul className="text-xs text-[#6b758a] space-y-2 list-disc list-inside">
            <li>
              Correlate electrical ECG depolarization with mechanical systole.
            </li>
            <li>
              Understand pressure gradient dynamics during isovolumetric
              contraction.
            </li>
            <li>
              Identify valve pathology origins using phonocardiogram sound
              triggers.
            </li>
          </ul>
        </div>
      </div>

      {/* Embedded Quiz Modal */}
      <QuizOverlayModal
        isOpen={Boolean(activeCheckpoint)}
        checkpoint={activeCheckpoint}
        moduleId={moduleData?.id}
        onComplete={handleQuizComplete}
        onClose={() => setActiveCheckpoint(null)}
      />
    </div>
  );
}
