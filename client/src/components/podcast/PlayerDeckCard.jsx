import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Radio,
  ListMusic,
} from "lucide-react";
import { useAudio } from "../../context/AudioContext";

const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function PlayerDeckCard({
  episode,
  show,
  relatedEpisodes = [],
}) {
  const {
    currentEpisode,
    isPlaying,
    playEpisode,
    togglePlayPause,
    skip,
    playbackSpeed,
    changeSpeed,
    volume,
    changeVolume,
    isReconnecting,
  } = useAudio();

  const isCurrent = currentEpisode?.id === episode?.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  const handleMainPlay = () => {
    if (isCurrent) {
      togglePlayPause();
    } else if (episode) {
      playEpisode(episode, show, relatedEpisodes);
    }
  };

  const upcomingQueue = relatedEpisodes.filter(
    (ep) => ep.id !== (currentEpisode?.id || episode?.id),
  );

  return (
    <div className="bg-white border border-[#e3e8f0] p-6 rounded-2xl shadow-sm flex flex-col gap-6 w-full lg:w-96">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#171c29] text-base">
          Interactive Audio Control Deck
        </h3>
        <span className="bg-[#17a34a] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
          {isReconnecting ? "Reconnecting..." : "Connected • MP3"}
        </span>
      </div>

      {/* Large Artwork / Deck Hero */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#2663eb] to-blue-800 flex items-center justify-center text-white shadow-md">
        {show?.cover_image_url ? (
          <img
            src={show.cover_image_url}
            alt={show.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        ) : null}
        <div className="relative z-10 flex flex-col items-center gap-2 text-center p-4">
          <span className="text-4xl animate-pulse">🎧</span>
          <p className="font-bold text-sm tracking-wide">
            {show?.title || "Tech Pulse Daily"}
          </p>
          <p className="text-xs text-blue-100 line-clamp-1">{episode?.title}</p>
        </div>
      </div>

      {/* Playback Primary Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => skip(-15)}
          className="p-2.5 rounded-xl text-[#707a8c] hover:text-[#171c29] hover:bg-slate-100 transition-colors flex flex-col items-center text-[10px] font-bold"
          title="Skip backward 15 seconds"
        >
          <RotateCcw className="w-5 h-5 mb-0.5" />
          <span>-15s</span>
        </button>

        <button
          type="button"
          onClick={handleMainPlay}
          aria-label={isCurrentPlaying ? "Pause" : "Play"}
          className="w-16 h-16 rounded-2xl bg-[#2663eb] text-white flex items-center justify-center shadow-md hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
        >
          {isCurrentPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={() => skip(15)}
          className="p-2.5 rounded-xl text-[#707a8c] hover:text-[#171c29] hover:bg-slate-100 transition-colors flex flex-col items-center text-[10px] font-bold"
          title="Skip forward 15 seconds"
        >
          <RotateCw className="w-5 h-5 mb-0.5" />
          <span>+15s</span>
        </button>
      </div>

      {/* Speed Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#707a8c] uppercase tracking-wider block">
          Playback Speed
        </label>
        <div className="grid grid-cols-6 gap-1 bg-[#f2f5fa] p-1 rounded-xl border border-[#e3e8f0]">
          {SPEEDS.map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => changeSpeed(spd)}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                playbackSpeed === spd
                  ? "bg-[#2663eb] text-white shadow-xs"
                  : "text-[#707a8c] hover:text-[#171c29]"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Volume Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#707a8c]">
          <span className="font-semibold uppercase tracking-wider">Volume</span>
          <span className="font-mono">{Math.round(volume * 100)}%</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => changeVolume(volume === 0 ? 0.8 : 0)}
            className="text-[#707a8c] hover:text-[#171c29]"
            aria-label="Toggle Mute"
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
            className="w-full accent-[#2663eb] cursor-pointer"
          />
        </div>
      </div>

      {/* Up Next in Queue */}
      <div className="space-y-3 pt-3 border-t border-[#e3e8f0]">
        <h4 className="text-xs font-bold text-[#171c29] flex items-center gap-1.5">
          <ListMusic className="w-4 h-4 text-[#2663eb]" />
          <span>Up Next in Queue ({upcomingQueue.length})</span>
        </h4>

        {upcomingQueue.length === 0 ? (
          <p className="text-xs text-[#707a8c] italic">
            No more episodes queued
          </p>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {upcomingQueue.slice(0, 4).map((ep, idx) => (
              <div
                key={ep.id}
                className="p-2.5 bg-[#f8fafc] border border-[#e3e8f0] rounded-xl flex items-center justify-between hover:bg-blue-50/40 transition-colors"
              >
                <div className="flex-1 mr-2">
                  <p className="text-xs font-bold text-[#171c29] line-clamp-1">
                    {ep.title}
                  </p>
                  <p className="text-[11px] text-[#707a8c]">
                    Ep. {ep.episode_number} •{" "}
                    {Math.floor(ep.duration_seconds / 60)}m
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => playEpisode(ep, show, relatedEpisodes)}
                  className="p-1.5 rounded-lg bg-white border border-[#e3e8f0] text-[#2663eb] hover:bg-[#2663eb] hover:text-white transition-colors"
                  title="Play Episode"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
