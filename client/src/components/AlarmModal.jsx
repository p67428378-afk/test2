import React, { useState, useEffect } from "react";
import { X, Bell, Volume2, Save } from "lucide-react";

const WEEKDAYS = [
  { id: "MON", label: "M" },
  { id: "TUE", label: "T" },
  { id: "WED", label: "W" },
  { id: "THU", label: "T" },
  { id: "FRI", label: "F" },
  { id: "SAT", label: "S" },
  { id: "SUN", label: "S" },
];

export default function AlarmModal({
  isOpen = false,
  alarm = null,
  onClose,
  onSave,
  onPreviewChime,
}) {
  const [time, setTime] = useState("07:30");
  const [label, setLabel] = useState("Morning Wakeup");
  const [soundType, setSoundType] = useState("mechanical_bell");
  const [repeatDays, setRepeatDays] = useState([
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
  ]);
  const [snoozeDuration, setSnoozeDuration] = useState(5);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (alarm) {
      setTime(alarm.time || "07:30");
      setLabel(alarm.label || "Alarm");
      setSoundType(alarm.sound_type || "mechanical_bell");
      setRepeatDays(alarm.repeat_days || []);
      setSnoozeDuration(alarm.snooze_duration_minutes || 5);
      setEnabled(alarm.enabled !== undefined ? alarm.enabled : true);
    } else {
      setTime("07:30");
      setLabel("Morning Wakeup");
      setSoundType("mechanical_bell");
      setRepeatDays(["MON", "TUE", "WED", "THU", "FRI"]);
      setSnoozeDuration(5);
      setEnabled(true);
    }
    setError("");
  }, [alarm, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (dayId) => {
    if (repeatDays.includes(dayId)) {
      setRepeatDays(repeatDays.filter((d) => d !== dayId));
    } else {
      setRepeatDays([...repeatDays, dayId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!time || !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      setError("Please enter a valid time in HH:MM format (24-hour).");
      return;
    }

    const payload = {
      time,
      label: label || "Alarm",
      sound_type: soundType,
      repeat_days: repeatDays,
      snooze_duration_minutes: Number(snoozeDuration),
      enabled,
    };

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alarm-modal-title"
    >
      <div className="w-full max-w-md bg-stone-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2 text-amber-200">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 id="alarm-modal-title" className="font-serif text-xl font-bold">
              {alarm ? "Edit Vintage Alarm" : "New Vintage Alarm"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-amber-400/60 hover:text-amber-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Time Picker */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              Alarm Time (24h)
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 bg-stone-950 border border-amber-500/40 rounded-xl text-3xl font-mono font-bold text-amber-100 text-center focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Alarm Label */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              Label / Description
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Morning Coffee"
              className="w-full p-2.5 bg-stone-950 border border-amber-500/30 rounded-xl text-sm font-serif text-amber-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Sound Selector & Preview */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              Chime Sound Alert
            </label>
            <div className="flex gap-2">
              <select
                value={soundType}
                onChange={(e) => setSoundType(e.target.value)}
                className="flex-1 p-2.5 bg-stone-950 border border-amber-500/30 rounded-xl text-sm font-serif text-amber-100 focus:outline-none focus:border-amber-400"
              >
                <option value="mechanical_bell">Mechanical Bell</option>
                <option value="vintage_radio_chime">Vintage Radio Chime</option>
              </select>
              <button
                type="button"
                onClick={() => onPreviewChime && onPreviewChime(soundType)}
                className="p-2.5 bg-amber-900/40 border border-amber-500/40 hover:bg-amber-800/60 text-amber-300 rounded-xl flex items-center gap-1 text-xs font-semibold"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test</span>
              </button>
            </div>
          </div>

          {/* Repeat Schedule */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-amber-400 mb-2">
              Repeat Schedule
            </label>
            <div className="flex justify-between gap-1">
              {WEEKDAYS.map((day) => {
                const isSelected = repeatDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`w-9 h-9 rounded-lg font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-amber-500 text-stone-950 border border-amber-300 shadow-md"
                        : "bg-stone-950 text-amber-400/60 border border-stone-800"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Snooze Duration */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-semibold uppercase text-amber-400">
                Snooze Duration
              </label>
              <span className="text-xs font-mono text-amber-200">
                {snoozeDuration} mins
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={snoozeDuration}
              onChange={(e) => setSnoozeDuration(e.target.value)}
              className="w-full accent-amber-500 bg-stone-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Alarm</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
