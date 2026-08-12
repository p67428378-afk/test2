import React from "react";

export default function AnalogClockDial({
  time = new Date(),
  theme = "antique_brass",
  showSecondHand = true,
}) {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Hand angles
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  const romanNumerals = [
    "XII",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
  ];

  // Theme styling configurations
  const themeStyles = {
    antique_brass: {
      bgGradient: "bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950",
      outerRim:
        "border-8 border-amber-600/80 shadow-[0_0_30px_rgba(212,175,55,0.3)]",
      innerDial: "bg-stone-900/90 border border-amber-500/30",
      textColor: "text-amber-200/90",
      tickColor: "bg-amber-500/60",
      hourHand: "bg-amber-300 shadow-md",
      minuteHand: "bg-amber-200 shadow-sm",
      secondHand: "bg-amber-500",
      centerCap: "bg-amber-400 border-2 border-amber-600",
    },
    wooden_mantle: {
      bgGradient:
        "bg-gradient-to-br from-amber-900 via-yellow-950 to-stone-900",
      outerRim:
        "border-[10px] border-amber-800 shadow-[0_0_25px_rgba(61,43,31,0.6)]",
      innerDial: "bg-amber-950/80 border border-amber-700/40",
      textColor: "text-amber-100",
      tickColor: "bg-amber-600/70",
      hourHand: "bg-amber-100 shadow-md",
      minuteHand: "bg-amber-200 shadow-sm",
      secondHand: "bg-rose-500",
      centerCap: "bg-amber-600 border-2 border-amber-800",
    },
    retro_neon: {
      bgGradient:
        "bg-gradient-to-br from-slate-950 via-neutral-950 to-slate-900",
      outerRim:
        "border-8 border-amber-500/60 shadow-[0_0_35px_rgba(255,223,128,0.5)]",
      innerDial: "bg-black/90 border border-amber-400/50",
      textColor: "text-amber-400 drop-shadow-[0_0_8px_rgba(255,223,128,0.8)]",
      tickColor: "bg-amber-400/80 shadow-[0_0_5px_rgba(255,223,128,0.8)]",
      hourHand: "bg-amber-300 shadow-[0_0_10px_rgba(255,223,128,0.8)]",
      minuteHand: "bg-amber-200 shadow-[0_0_8px_rgba(255,223,128,0.6)]",
      secondHand: "bg-amber-400 shadow-[0_0_12px_rgba(255,223,128,1)]",
      centerCap: "bg-amber-300 border-2 border-amber-500",
    },
  };

  const style = themeStyles[theme] || themeStyles.antique_brass;

  return (
    <div
      className={`relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center transition-all duration-500 ${style.bgGradient} ${style.outerRim}`}
      aria-label="Analog Clock Dial"
    >
      {/* Inner Dial Face */}
      <div
        className={`relative w-[88%] h-[88%] rounded-full flex items-center justify-center ${style.innerDial}`}
      >
        {/* Hour Ticks & Numerals */}
        {romanNumerals.map((num, i) => {
          const angle = i * 30; // 360 / 12 = 30 deg
          return (
            <div
              key={num}
              className="absolute w-full h-full flex justify-center items-start pt-2 pointer-events-none"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div
                className="flex flex-col items-center"
                style={{ transform: `rotate(-${angle}deg)` }}
              >
                <span
                  className={`text-base sm:text-lg font-serif font-bold ${style.textColor}`}
                >
                  {num}
                </span>
              </div>
            </div>
          );
        })}

        {/* 60 Minute Tick Marks */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full flex justify-center items-start pt-1 pointer-events-none"
            style={{ transform: `rotate(${i * 6}deg)` }}
          >
            <div
              className={`w-[2px] ${i % 5 === 0 ? "h-3 opacity-90" : "h-1.5 opacity-40"} ${style.tickColor}`}
            />
          </div>
        ))}

        {/* Hour Hand */}
        <div
          className="absolute w-full h-full flex justify-center items-center pointer-events-none"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        >
          <div
            className={`w-2 h-20 sm:h-24 md:h-28 rounded-full -translate-y-1/2 origin-bottom ${style.hourHand}`}
          />
        </div>

        {/* Minute Hand */}
        <div
          className="absolute w-full h-full flex justify-center items-center pointer-events-none"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        >
          <div
            className={`w-1.5 h-28 sm:h-32 md:h-36 rounded-full -translate-y-1/2 origin-bottom ${style.minuteHand}`}
          />
        </div>

        {/* Second Hand */}
        {showSecondHand && (
          <div
            className="absolute w-full h-full flex justify-center items-center pointer-events-none"
            style={{ transform: `rotate(${secondDeg}deg)` }}
          >
            <div
              className={`w-0.5 h-32 sm:h-36 md:h-40 -translate-y-1/2 origin-bottom ${style.secondHand}`}
            />
          </div>
        )}

        {/* Center Pivot Cap */}
        <div
          className={`absolute w-5 h-5 rounded-full z-10 ${style.centerCap}`}
        />
      </div>
    </div>
  );
}
