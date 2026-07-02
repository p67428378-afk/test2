import React, { useState, useEffect } from "react";

export default function CircularCountdownTimer({
  initialSeconds = 300,
  onTimeUp,
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Circular progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (secondsLeft / initialSeconds) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-surface-container-highest"
            strokeWidth="6"
            fill="transparent"
          />
          {/* Foreground Circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-error"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono-data text-lg font-bold text-on-surface">
            {formattedTime}
          </span>
        </div>
      </div>
      <span className="text-xs text-on-surface-variant uppercase tracking-wider">
        Time to respond
      </span>
    </div>
  );
}
