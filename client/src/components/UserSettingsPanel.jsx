import React from "react";
import { Settings, RefreshCw, Clock, Globe, Eye } from "lucide-react";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Kolkata",
  "Australia/Sydney",
];

export default function UserSettingsPanel({
  settings = {},
  onUpdateSettings,
  onSyncUtc,
  serverTime,
  isSyncing = false,
}) {
  const handleChange = (field, value) => {
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, [field]: value });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2 text-amber-200">
          <Settings className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif text-lg font-bold">
            Display & Time Settings
          </h3>
        </div>

        <button
          type="button"
          onClick={onSyncUtc}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-mono font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-amber-400" : ""}`}
          />
          <span>Sync UTC Time</span>
        </button>
      </div>

      {serverTime && (
        <div className="p-3 bg-stone-950 border border-amber-500/20 rounded-xl text-xs font-mono text-amber-300/80 flex flex-wrap items-center justify-between gap-2">
          <span>
            Server UTC:{" "}
            <strong className="text-amber-200">
              {serverTime.utc_datetime}
            </strong>
          </span>
          <span>
            Timezone:{" "}
            <strong className="text-amber-200">{serverTime.timezone}</strong>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Format */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400">
            <Clock className="w-4 h-4" />
            <span>Time Format</span>
          </label>
          <div className="flex bg-stone-950 border border-stone-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleChange("time_format", "12h")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                settings.time_format === "12h"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-amber-300/70 hover:text-amber-100"
              }`}
            >
              12-Hour (AM/PM)
            </button>
            <button
              type="button"
              onClick={() => handleChange("time_format", "24h")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                settings.time_format === "24h"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-amber-300/70 hover:text-amber-100"
              }`}
            >
              24-Hour
            </button>
          </div>
        </div>

        {/* Time Zone */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400">
            <Globe className="w-4 h-4" />
            <span>Time Zone</span>
          </label>
          <select
            value={settings.time_zone || "UTC"}
            onChange={(e) => handleChange("time_zone", e.target.value)}
            className="w-full p-2.5 bg-stone-950 border border-amber-500/30 rounded-xl text-xs font-mono text-amber-100 focus:outline-none focus:border-amber-400"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </div>

        {/* Show Second Hand Toggle */}
        <div className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Show Second Hand / Seconds</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.show_second_hand}
            onClick={() =>
              handleChange("show_second_hand", !settings.show_second_hand)
            }
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.show_second_hand
                ? "bg-amber-500 justify-end"
                : "bg-stone-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-stone-950 shadow-md" />
          </button>
        </div>
      </div>
    </div>
  );
}
