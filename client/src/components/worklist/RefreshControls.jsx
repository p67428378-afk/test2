import React, { useState, useEffect, useRef } from "react";

export default function RefreshControls({ onRefresh, lastUpdated, loading }) {
  const [intervalTime, setIntervalTime] = useState(300000); // Default 5 minutes (300,000 ms)
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const timerRef = useRef(null);
  const secondsTimerRef = useRef(null);

  // Handle manual refresh click with animation
  const handleManualRefresh = () => {
    setIsRotating(true);
    onRefresh();
    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
  };

  // Track seconds since last update
  useEffect(() => {
    setSecondsSinceUpdate(0);
    if (secondsTimerRef.current) clearInterval(secondsTimerRef.current);

    secondsTimerRef.current = setInterval(() => {
      setSecondsSinceUpdate((prev) => prev + 1);
    }, 1000);

    return () => {
      if (secondsTimerRef.current) clearInterval(secondsTimerRef.current);
    };
  }, [lastUpdated]);

  // Automatic timed refresh with tab visibility check
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const startPolling = () => {
      timerRef.current = setInterval(() => {
        if (!document.hidden) {
          onRefresh();
        }
      }, intervalTime);
    };

    startPolling();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        onRefresh(); // Refresh immediately when tab becomes active
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalTime, onRefresh]);

  const formatLastUpdated = () => {
    if (secondsSinceUpdate < 5) return "Just now";
    if (secondsSinceUpdate < 60) return `${secondsSinceUpdate} seconds ago`;
    const minutes = Math.floor(secondsSinceUpdate / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">Interval:</span>
        <select
          value={intervalTime}
          onChange={(e) => setIntervalTime(Number(e.target.value))}
          className="px-2 py-1 bg-white border border-outline-variant rounded-lg text-xs focus:ring-2 focus:ring-primary-container focus:border-transparent outline-none"
        >
          <option value={10000}>10 Seconds</option>
          <option value={30000}>30 Seconds</option>
          <option value={60000}>1 Minute</option>
          <option value={300000}>5 Minutes</option>
          <option value={600000}>10 Minutes</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 relative">
          <svg className="w-5 h-5 text-primary" viewBox="0 0 36 36">
            <path
              className="stroke-current text-surface-container-highest"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
            ></path>
            <path
              className="stroke-current transition-all duration-500"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeDasharray={`${Math.min(100, Math.max(0, 100 - (secondsSinceUpdate / (intervalTime / 1000)) * 100))}, 100`}
              strokeLinecap="round"
              strokeWidth="3"
            ></path>
          </svg>
        </div>
        <span className="text-xs font-medium">75% Capacity</span>
      </div>

      <span className="text-xs">Last updated: {formatLastUpdated()}</span>

      <button
        onClick={handleManualRefresh}
        disabled={loading}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <span
          className={`material-symbols-outlined text-[18px] ${isRotating ? "animate-spin" : ""}`}
          data-icon="refresh"
          style={{ display: "inline-block" }}
        >
          refresh
        </span>
        Refresh
      </button>
    </div>
  );
}
