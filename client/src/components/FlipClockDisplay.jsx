import React from "react";

export default function FlipClockDisplay({
  time = new Date(),
  timeFormat = "12h",
  showSecondHand = true,
  theme = "antique_brass",
}) {
  let hours = time.getHours();
  let ampm = "";

  if (timeFormat === "12h") {
    ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
  }

  const formatTwoDigits = (num) => String(num).padStart(2, "0");

  const hoursStr = formatTwoDigits(hours);
  const minutesStr = formatTwoDigits(time.getMinutes());
  const secondsStr = formatTwoDigits(time.getSeconds());

  const cardThemeStyles = {
    antique_brass: {
      cardBg: "bg-amber-950 border-amber-600/70 text-amber-200",
      hingeBg: "bg-amber-800/80",
      subTextColor: "text-amber-400/80",
    },
    wooden_mantle: {
      cardBg: "bg-stone-900 border-amber-700/60 text-amber-100",
      hingeBg: "bg-amber-900/80",
      subTextColor: "text-amber-300/80",
    },
    retro_neon: {
      cardBg:
        "bg-black border-amber-400/80 text-amber-400 drop-shadow-[0_0_10px_rgba(255,223,128,0.8)]",
      hingeBg: "bg-amber-500/60",
      subTextColor: "text-amber-300",
    },
  };

  const style = cardThemeStyles[theme] || cardThemeStyles.antique_brass;

  const FlipCard = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center w-16 h-20 sm:w-20 sm:h-24 md:w-28 md:h-32 rounded-lg border-2 shadow-2xl font-mono text-3xl sm:text-4xl md:text-6xl font-bold overflow-hidden transition-all duration-300 ${style.cardBg}`}
      >
        {/* Horizontal Split Line / Mechanical Hinge */}
        <div
          className={`absolute w-full h-[2px] top-1/2 left-0 z-10 -translate-y-1/2 ${style.hingeBg}`}
        />
        <span>{value}</span>
      </div>
      {label && (
        <span
          className={`text-xs font-mono font-semibold uppercase mt-2 tracking-wider ${style.subTextColor}`}
        >
          {label}
        </span>
      )}
    </div>
  );

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-6 px-4 bg-stone-900/60 border border-amber-500/20 rounded-2xl shadow-inner backdrop-blur-sm"
      aria-label="Mechanical Flip Clock Display"
    >
      <FlipCard value={hoursStr} label="Hours" />
      <span className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold text-amber-500/70 animate-pulse">
        :
      </span>
      <FlipCard value={minutesStr} label="Minutes" />

      {showSecondHand && (
        <>
          <span className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold text-amber-500/70 animate-pulse">
            :
          </span>
          <FlipCard value={secondsStr} label="Seconds" />
        </>
      )}

      {timeFormat === "12h" && (
        <div className="flex flex-col justify-center items-center ml-1 sm:ml-2">
          <div
            className={`px-2 py-1 rounded text-xs sm:text-sm font-mono font-bold uppercase border tracking-widest ${
              ampm === "AM"
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-amber-600/30 border-amber-400 text-amber-200"
            }`}
          >
            {ampm}
          </div>
        </div>
      )}
    </div>
  );
}
