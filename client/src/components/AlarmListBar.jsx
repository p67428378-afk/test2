import React from "react";
import { Bell, Plus, Trash2, Edit2, Volume2 } from "lucide-react";

export default function AlarmListBar({
  alarms = [],
  onToggleAlarm,
  onOpenModal,
  onDeleteAlarm,
  onPreviewChime,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2 text-amber-200">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-serif text-lg font-bold">Active Alarms</h3>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
            {alarms.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onOpenModal && onOpenModal(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold text-xs rounded-lg transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Alarm</span>
        </button>
      </div>

      {alarms.length === 0 ? (
        <p className="text-center py-6 text-sm text-amber-200/50 font-mono">
          No alarms configured yet. Click "+ New Alarm" to set one.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                alarm.enabled
                  ? "bg-amber-950/40 border-amber-500/40 shadow-md"
                  : "bg-stone-950/40 border-stone-800 opacity-60"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-mono font-bold text-amber-100">
                    {alarm.time}
                  </span>
                  <span className="text-xs font-serif text-amber-400 font-semibold px-2 py-0.5 bg-amber-900/60 rounded">
                    {alarm.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-300/70 font-mono">
                  <span>
                    {alarm.repeat_days && alarm.repeat_days.length > 0
                      ? alarm.repeat_days.join(", ")
                      : "Once"}
                  </span>
                  <span>•</span>
                  <span className="capitalize">
                    {alarm.sound_type.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Preview Chime"
                  onClick={() =>
                    onPreviewChime && onPreviewChime(alarm.sound_type)
                  }
                  className="p-1.5 text-amber-400 hover:text-amber-200 hover:bg-amber-900/40 rounded transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Edit Alarm"
                  onClick={() => onOpenModal && onOpenModal(alarm)}
                  className="p-1.5 text-amber-300 hover:text-amber-100 hover:bg-amber-900/40 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Delete Alarm"
                  onClick={() => onDeleteAlarm && onDeleteAlarm(alarm.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Enable/Disable Toggle */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={alarm.enabled}
                  onClick={() =>
                    onToggleAlarm && onToggleAlarm(alarm.id, !alarm.enabled)
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    alarm.enabled
                      ? "bg-amber-500 justify-end"
                      : "bg-stone-700 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-stone-950 shadow-md" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
