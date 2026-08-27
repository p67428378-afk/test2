import React from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useAudio } from "../../context/AudioContext";

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
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
  return `${mins}:${formattedSecs}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function EpisodeRow({ episode, show, allEpisodes = [] }) {
  const { currentEpisode, isPlaying, playEpisode, togglePlayPause } =
    useAudio();

  if (!episode) return null;

  const isCurrent = currentEpisode?.id === episode.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playEpisode(episode, show, allEpisodes);
    }
  };

  return (
    <div
      className={`border rounded-xl p-4 md:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isCurrent
          ? "bg-blue-50/60 border-[#2663eb] shadow-sm"
          : "bg-white border-[#e3e8f0] hover:border-[#2663eb]/40 hover:shadow-sm"
      }`}
      data-testid={`episode-row-${episode.id}`}
    >
      {/* Left info */}
      <div className="flex items-start gap-4 flex-1">
        <button
          type="button"
          onClick={handlePlayClick}
          aria-label={isCurrentPlaying ? "Pause Episode" : "Play Episode"}
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-sm ${
            isCurrentPlaying
              ? "bg-[#2663eb] text-white hover:bg-blue-700 ring-4 ring-blue-100"
              : "bg-[#f2f5fa] text-[#2663eb] hover:bg-[#2663eb] hover:text-white"
          }`}
        >
          {isCurrentPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex flex-col gap-1 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#707a8c]">
            <span className="font-semibold text-[#2663eb] bg-blue-100/70 px-2 py-0.5 rounded-md">
              Ep. {episode.episode_number || "#"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(episode.publish_date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(episode.duration_seconds)} (
              {episode.duration_seconds}s)
            </span>
          </div>

          <Link
            to={`/episodes/${episode.id}`}
            className="font-bold text-[#171c29] text-sm md:text-base hover:text-[#2663eb] transition-colors leading-snug line-clamp-1"
          >
            {episode.title}
          </Link>

          <p className="text-xs text-[#707a8c] line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
        </div>
      </div>

      {/* Right Action buttons */}
      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
        <Link
          to={`/episodes/${episode.id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#f2f5fa] hover:bg-slate-200 text-[#171c29] flex items-center gap-1 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[#707a8c]" />
          <span>Show Notes</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#707a8c]" />
        </Link>

        <button
          type="button"
          onClick={handlePlayClick}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
            isCurrentPlaying
              ? "bg-[#2663eb] text-white hover:bg-blue-700"
              : "bg-white border border-[#e3e8f0] text-[#171c29] hover:bg-[#2663eb] hover:text-white hover:border-[#2663eb]"
          }`}
        >
          {isCurrentPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Playing</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Play</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
