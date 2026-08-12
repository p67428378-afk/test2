import React from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioUnlockBanner({ isUnlocked = false, onUnlock }) {
  if (isUnlocked) return null;

  return (
    <div className="w-full max-w-xl mx-auto my-3 p-3 bg-amber-950/80 border border-amber-500/50 rounded-xl shadow-lg flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
          <VolumeX className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-amber-200">
            Audio Playback Blocked
          </p>
          <p className="text-xs text-amber-400/80">
            Click enable to allow authentic vintage chime & alarm sound alerts.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onUnlock}
        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md whitespace-nowrap"
      >
        <Volume2 className="w-4 h-4" />
        Enable Audio
      </button>
    </div>
  );
}
