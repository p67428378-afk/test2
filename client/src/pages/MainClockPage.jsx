import React, { useState, useEffect, useRef } from "react";
import {
  clockService,
  alarmService,
  settingsService,
} from "../services/api.js";
import { chimesService } from "../services/webAudioChimes.js";

import AnalogClockDial from "../components/AnalogClockDial.jsx";
import FlipClockDisplay from "../components/FlipClockDisplay.jsx";
import ClockViewSwitcher from "../components/ClockViewSwitcher.jsx";
import AudioUnlockBanner from "../components/AudioUnlockBanner.jsx";
import AlarmListBar from "../components/AlarmListBar.jsx";
import AlarmModal from "../components/AlarmModal.jsx";
import ThemeGallery from "../components/ThemeGallery.jsx";
import UserSettingsPanel from "../components/UserSettingsPanel.jsx";

import { Clock, BellRing, Volume2, Sparkles, AlertCircle } from "lucide-react";

export default function MainClockPage() {
  const [time, setTime] = useState(new Date());
  const [serverTime, setServerTime] = useState(null);
  const [timeOffsetMs, setTimeOffsetMs] = useState(0);

  const [settings, setSettings] = useState({
    clock_mode: "flip",
    theme_id: "antique_brass",
    time_format: "12h",
    show_second_hand: true,
    time_zone: "UTC",
  });

  const [alarms, setAlarms] = useState([]);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [activeTriggeredAlarm, setActiveTriggeredAlarm] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const triggeredAlarmIdsRef = useRef(new Set());

  // Load initial settings and alarms
  useEffect(() => {
    fetchSettings();
    fetchAlarms();
    syncUtcTime();
  }, []);

  // Real-time tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date(Date.now() + timeOffsetMs);
      setTime(now);
      checkAlarms(now);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeOffsetMs, alarms]);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (e) {
      console.warn("Failed to fetch settings from backend:", e);
    }
  };

  const fetchAlarms = async () => {
    try {
      const data = await alarmService.getAlarms();
      if (Array.isArray(data)) {
        setAlarms(data);
      }
    } catch (e) {
      console.warn("Failed to fetch alarms from backend:", e);
    }
  };

  const syncUtcTime = async () => {
    setIsSyncing(true);
    setErrorMsg("");
    try {
      const data = await clockService.getServerTime(settings.time_zone);
      setServerTime(data);
      if (data && data.timestamp_ms) {
        const offset = data.timestamp_ms - Date.now();
        setTimeOffsetMs(offset);
      }
    } catch (e) {
      console.warn("Failed to sync UTC server time:", e);
      setErrorMsg("Unable to reach UTC time sync service.");
    } finally {
      setIsSyncing(false);
    }
  };

  const checkAlarms = (now) => {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = now.getSeconds();
    const timeStr = `${hours}:${minutes}`;

    const daysMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const currentDay = daysMap[now.getDay()];

    alarms.forEach((alarm) => {
      if (
        alarm.enabled &&
        alarm.time === timeStr &&
        seconds === 0 &&
        (!alarm.repeat_days ||
          alarm.repeat_days.length === 0 ||
          alarm.repeat_days.includes(currentDay))
      ) {
        if (!triggeredAlarmIdsRef.current.has(alarm.id)) {
          triggeredAlarmIdsRef.current.add(alarm.id);
          triggerAlarmAlert(alarm);
        }
      }
    });

    // Clear triggered ref once second passes 0
    if (seconds > 2) {
      triggeredAlarmIdsRef.current.clear();
    }
  };

  const triggerAlarmAlert = (alarm) => {
    setActiveTriggeredAlarm(alarm);
    chimesService.playChime(alarm.sound_type);
  };

  const handleUnlockAudio = async () => {
    const unlocked = await chimesService.unlock();
    setIsAudioUnlocked(unlocked);
  };

  const handleModeChange = async (newMode) => {
    const updated = { ...settings, clock_mode: newMode };
    setSettings(updated);
    try {
      await settingsService.updateSettings({ clock_mode: newMode });
    } catch (e) {
      console.warn("Failed to update clock_mode:", e);
    }
  };

  const handleThemeSelect = async (themeId) => {
    const updated = { ...settings, theme_id: themeId };
    setSettings(updated);
    try {
      await settingsService.updateSettings({ theme_id: themeId });
    } catch (e) {
      console.warn("Failed to update theme_id:", e);
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      await settingsService.updateSettings(newSettings);
    } catch (e) {
      console.warn("Failed to update settings:", e);
    }
  };

  const handleToggleAlarm = async (alarmId, enabled) => {
    const updatedList = alarms.map((a) =>
      a.id === alarmId ? { ...a, enabled } : a,
    );
    setAlarms(updatedList);
    try {
      await alarmService.updateAlarm(alarmId, { enabled });
    } catch (e) {
      console.warn("Failed to toggle alarm:", e);
      fetchAlarms();
    }
  };

  const handleDeleteAlarm = async (alarmId) => {
    const filtered = alarms.filter((a) => a.id !== alarmId);
    setAlarms(filtered);
    try {
      await alarmService.deleteAlarm(alarmId);
    } catch (e) {
      console.warn("Failed to delete alarm:", e);
      fetchAlarms();
    }
  };

  const handleSaveAlarm = async (payload) => {
    try {
      if (editingAlarm) {
        const updated = await alarmService.updateAlarm(
          editingAlarm.id,
          payload,
        );
        setAlarms(alarms.map((a) => (a.id === editingAlarm.id ? updated : a)));
      } else {
        const created = await alarmService.createAlarm(payload);
        setAlarms([...alarms, created]);
      }
      setIsModalOpen(false);
      setEditingAlarm(null);
    } catch (e) {
      console.error("Failed to save alarm:", e);
      // Fallback update on local error
      if (!editingAlarm) {
        const fallback = { ...payload, id: "temp-" + Date.now() };
        setAlarms([...alarms, fallback]);
      }
      setIsModalOpen(false);
    }
  };

  const handleSnoozeAlarm = () => {
    if (!activeTriggeredAlarm) return;
    const snoozeMinutes = activeTriggeredAlarm.snooze_duration_minutes || 5;
    alert(`Alarm snoozed for ${snoozeMinutes} minutes.`);
    setActiveTriggeredAlarm(null);
  };

  const handleDismissAlarm = () => {
    setActiveTriggeredAlarm(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-amber-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-stone-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 rounded-xl shadow-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-amber-100">
                Vintage Clock
              </h1>
              <p className="text-xs font-serif text-amber-400/70">
                Authentic Timekeeping & Retro Chimes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClockViewSwitcher
              currentMode={settings.clock_mode}
              onModeChange={handleModeChange}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        <AudioUnlockBanner
          isUnlocked={isAudioUnlocked}
          onUnlock={handleUnlockAudio}
        />

        {errorMsg && (
          <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Clock View */}
        <section className="flex flex-col items-center justify-center py-6">
          {settings.clock_mode === "analog" && (
            <AnalogClockDial
              time={time}
              theme={settings.theme_id}
              showSecondHand={settings.show_second_hand}
            />
          )}

          {settings.clock_mode === "flip" && (
            <FlipClockDisplay
              time={time}
              timeFormat={settings.time_format}
              showSecondHand={settings.show_second_hand}
              theme={settings.theme_id}
            />
          )}

          {settings.clock_mode === "hybrid" && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <AnalogClockDial
                time={time}
                theme={settings.theme_id}
                showSecondHand={settings.show_second_hand}
              />
              <FlipClockDisplay
                time={time}
                timeFormat={settings.time_format}
                showSecondHand={settings.show_second_hand}
                theme={settings.theme_id}
              />
            </div>
          )}
        </section>

        {/* Alarm List Section */}
        <section>
          <AlarmListBar
            alarms={alarms}
            onToggleAlarm={handleToggleAlarm}
            onOpenModal={(alarmToEdit) => {
              setEditingAlarm(alarmToEdit);
              setIsModalOpen(true);
            }}
            onDeleteAlarm={handleDeleteAlarm}
            onPreviewChime={(st) => chimesService.playChime(st)}
          />
        </section>

        {/* Theme Gallery Section */}
        <section>
          <ThemeGallery
            selectedTheme={settings.theme_id}
            onSelectTheme={handleThemeSelect}
          />
        </section>

        {/* Display & Settings Section */}
        <section>
          <UserSettingsPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onSyncUtc={syncUtcTime}
            serverTime={serverTime}
            isSyncing={isSyncing}
          />
        </section>
      </main>

      {/* Alarm Modal Form */}
      <AlarmModal
        isOpen={isModalOpen}
        alarm={editingAlarm}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAlarm(null);
        }}
        onSave={handleSaveAlarm}
        onPreviewChime={(st) => chimesService.playChime(st)}
      />

      {/* Active Triggered Alarm Ringing Overlay Modal */}
      {activeTriggeredAlarm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-md w-full bg-stone-900 border-2 border-amber-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(212,175,55,0.5)] text-center space-y-6 animate-bounce-short">
            <div className="mx-auto w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/40">
              <BellRing className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h2 className="text-3xl font-mono font-bold text-amber-100">
                {activeTriggeredAlarm.time}
              </h2>
              <p className="text-lg font-serif font-semibold text-amber-300 mt-1">
                {activeTriggeredAlarm.label || "Alarm Ringing"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSnoozeAlarm}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-amber-200 font-semibold text-sm rounded-xl transition-colors"
              >
                Snooze ({activeTriggeredAlarm.snooze_duration_minutes || 5} Min)
              </button>
              <button
                type="button"
                onClick={handleDismissAlarm}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition-colors shadow-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-amber-500/10 py-6 text-center text-xs font-serif text-amber-400/50">
        Vintage Clock Application • SCRUM-49 • Built with React 18, Vite & Web
        Audio API
      </footer>
    </div>
  );
}
