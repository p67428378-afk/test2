import React from "react";
import { BookOpen, ExternalLink, Play, Hash, Sparkles } from "lucide-react";
import { useAudio } from "../../context/AudioContext";

function generateChapters(durationSeconds) {
  const dur = durationSeconds || 2340;
  return [
    { time: 0, timeLabel: "00:00", title: "Introduction & Episode Overview" },
    {
      time: Math.floor(dur * 0.15),
      timeLabel: formatTime(Math.floor(dur * 0.15)),
      title: "Core Concepts & Background Discussion",
    },
    {
      time: Math.floor(dur * 0.4),
      timeLabel: formatTime(Math.floor(dur * 0.4)),
      title: "Deep Dive: Architecture & Implementation",
    },
    {
      time: Math.floor(dur * 0.7),
      timeLabel: formatTime(Math.floor(dur * 0.7)),
      title: "Real-World Case Studies & Production Lessons",
    },
    {
      time: Math.floor(dur * 0.9),
      timeLabel: formatTime(Math.floor(dur * 0.9)),
      title: "Key Takeaways & Upcoming Topics",
    },
  ];
}

function formatTime(secs) {
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  return `${mins < 10 ? "0" : ""}${mins}:${remSecs < 10 ? "0" : ""}${remSecs}`;
}

export default function ShowNotesCard({ episode, show }) {
  const { seek, playEpisode, currentEpisode, isPlaying } = useAudio();

  if (!episode) return null;

  const chapters = generateChapters(episode.duration_seconds);

  const handleSeekChapter = (timeInSec) => {
    if (currentEpisode?.id !== episode.id) {
      playEpisode(episode, show);
    }
    seek(timeInSec);
  };

  return (
    <div className="bg-white border border-[#e3e8f0] p-6 md:p-8 rounded-2xl shadow-sm flex flex-col gap-6">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2663eb] mb-2">
          <BookOpen className="w-4 h-4" />
          <span>FULL SHOW NOTES & TIMESTAMPS</span>
        </div>
        <h2 className="font-bold text-[#171c29] text-xl md:text-2xl leading-snug mb-2">
          {episode.title}
        </h2>
        <p className="text-xs text-[#707a8c]">
          {show?.title || "Podcast Hub"} • Published{" "}
          {new Date(episode.publish_date || Date.now()).toLocaleDateString(
            "en-US",
            { month: "long", day: "numeric", year: "numeric" },
          )}
        </p>
      </div>

      {/* Episode Summary */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#171c29] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Episode Summary</span>
        </h3>
        <p className="text-sm text-[#171c29] leading-relaxed bg-[#f8fafc] p-4 rounded-xl border border-[#e3e8f0]">
          {episode.description}
        </p>
      </div>

      {/* Timestamped Chapters */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#171c29] flex items-center gap-1.5">
          <Hash className="w-4 h-4 text-[#2663eb]" />
          <span>Interactive Chapter Markers</span>
        </h3>
        <p className="text-xs text-[#707a8c]">
          Click any timestamp to jump directly to that chapter in the audio
          player.
        </p>

        <div className="divide-y divide-[#e3e8f0] border border-[#e3e8f0] rounded-xl overflow-hidden">
          {chapters.map((ch, idx) => (
            <button
              key={ch.timeLabel}
              type="button"
              onClick={() => handleSeekChapter(ch.time)}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-blue-50/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#2663eb] bg-blue-100/70 px-2 py-1 rounded-md group-hover:bg-[#2663eb] group-hover:text-white transition-colors">
                  {ch.timeLabel}
                </span>
                <span className="text-xs md:text-sm font-medium text-[#171c29] group-hover:text-[#2663eb] transition-colors">
                  {ch.title}
                </span>
              </div>
              <Play className="w-3.5 h-3.5 text-[#707a8c] group-hover:text-[#2663eb] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Referenced Links & Resources */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#171c29] flex items-center gap-1.5">
          <ExternalLink className="w-4 h-4 text-[#17a34a]" />
          <span>Links & Resources Referenced</span>
        </h3>
        <div className="bg-[#f2f5fa] border border-[#e3e8f0] p-4 rounded-xl space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-[#2663eb] font-bold">•</span>
            <a
              href="https://bfsi-na-ai-engineering-v4.atlassian.net/wiki/spaces/SCRUM2/pages/33062914/SCRUM-186+Feature+Specification"
              target="_blank"
              rel="noreferrer"
              className="text-[#2663eb] hover:underline flex items-center gap-1 break-all"
            >
              <span>Confluence Feature Specification (SCRUM-186)</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#2663eb] font-bold">•</span>
            <a
              href="https://bfsi-na-ai-engineering-v4.atlassian.net/wiki/spaces/SCRUM3/pages/32473115"
              target="_blank"
              rel="noreferrer"
              className="text-[#2663eb] hover:underline flex items-center gap-1 break-all"
            >
              <span>Project Architecture High-Level Design (HLD)</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#2663eb] font-bold">•</span>
            <span className="text-[#707a8c]">
              Audio Stream source: 320kbps Stereo MP3 master encoding.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
