import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  AlertCircle,
  Maximize2,
  Radio,
} from "lucide-react";
import { useAudio } from "../../context/AudioContext";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
  const totalSecs = Math.floor(seconds);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    const formattedMins = remMins < 10 ? `0${remMins}` : remMins;
    return `${hrs}:${formattedMins}:${formattedSecs}`;
  }
  const formattedMins = mins < 10 ? `0${mins}` : mins;
  return `${formattedMins}:${formattedSecs}`;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function StickyAudioPlayer() {
  const {
    currentEpisode,
    currentShow,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    isReconnecting,
    togglePlayPause,
    seek,
    skip,
    changeSpeed,
    changeVolume,
  } = useAudio();

  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);

  // If no episode loaded, render nothing or initial minimal dock
  if (!currentEpisode) {
    return null;
  }

  const progressPercent =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeekChange = (e) => {
    const newPercent = parseFloat(e.target.value);
    const newTime = (newPercent / 100) * duration;
    seek(newTime);
  };

  return (
    <aside
      aria-label="Audio Player"
      className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#e3e8f0] shadow-2xl z-50 transition-all duration-300"
      data-testid="sticky-audio-player"
    >
      {/* Reconnecting Alert Banner */}
      {isReconnecting && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-1 px-4 flex items-center justify-center gap-1.5 animate-pulse">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Reconnecting audio stream... Please wait</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3 w-full md:w-1/4 min-w-0">
          <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#2663eb] to-blue-700 flex items-center justify-center text-white shadow-sm">
            {currentShow?.cover_image_url ? (
              <img
                src={currentShow.cover_image_url}
                alt={currentShow.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">🎧</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              to={`/episodes/${currentEpisode.id}`}
              className="text-xs sm:text-sm font-bold text-[#171c29] hover:text-[#2663eb] transition-colors truncate block leading-snug"
              title={currentEpisode.title}
            >
              {currentEpisode.title}
            </Link>
            <p className="text-[11px] text-[#707a8c] truncate">
              {currentShow?.title || "Podcast Hub"} • Ep.{" "}
              {currentEpisode.episode_number || "#"}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls & Scrub Bar */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/4">
          {/* Main Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => skip(-15)}
              className="text-[#707a8c] hover:text-[#171c29] p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-0.5 text-xs font-semibold"
              title="Skip -15s"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[10px]">15s</span>
            </button>

            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-10 h-10 rounded-full bg-[#2663eb] text-white flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skip(15)}
              className="text-[#707a8c] hover:text-[#171c29] p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-0.5 text-xs font-semibold"
              title="Skip +15s"
            >
              <span className="text-[10px]">15s</span>
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Scrub Bar */}
          <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-[#707a8c]">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onChange={handleSeekChange}
                aria-label="Seek track position"
                className="w-full h-1.5 bg-[#e3e8f0] rounded-lg appearance-none cursor-pointer accent-[#2663eb] focus:outline-none"
              />
            </div>
            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Speed, Volume, Details Link */}
        <div className="hidden md:flex items-center justify-end gap-4 w-full md:w-1/4">
          {/* Speed Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
              className="px-2.5 py-1 rounded-full bg-[#f2f5fa] border border-[#e3e8f0] text-xs font-semibold text-[#171c29] hover:bg-[#2663eb] hover:text-white transition-colors"
            >
              {playbackSpeed}x
            </button>

            {isSpeedMenuOpen && (
              <div className="absolute bottom-full mb-2 right-0 bg-white border border-[#e3e8f0] rounded-xl p-1 shadow-lg flex flex-col gap-1 min-w-[70px] z-50">
                {SPEEDS.map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => {
                      changeSpeed(spd);
                      setIsSpeedMenuOpen(false);
                    }}
                    className={`px-3 py-1 text-xs rounded-lg text-left font-medium ${
                      playbackSpeed === spd
                        ? "bg-[#2663eb] text-white"
                        : "text-[#171c29] hover:bg-slate-100"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeVolume(volume === 0 ? 0.8 : 0)}
              aria-label="Toggle Mute"
              className="text-[#707a8c] hover:text-[#171c29]"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Volume slider"
              className="w-16 h-1.5 bg-[#e3e8f0] rounded-lg appearance-none cursor-pointer accent-[#2663eb]"
            />
          </div>

          {/* Expand to page link */}
          <Link
            to={`/episodes/${currentEpisode.id}`}
            title="Open Episode Full View"
            className="p-2 text-[#707a8c] hover:text-[#2663eb] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
