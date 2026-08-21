import React, { useState } from "react";

const BG_COLORS = [
  "bg-[#ffe5e5]", // Red-ish
  "bg-[#e5f2ff]", // Blue-ish
  "bg-[#f2ffe5]", // Green-ish
  "bg-[#fff2e5]", // Orange-ish
  "bg-[#f2e5ff]", // Purple-ish
  "bg-[#e5fff2]", // Mint-ish
  "bg-[#ffe5f2]", // Pink-ish
  "bg-[#e5faff]", // Cyan-ish
  "bg-[#fff7e5]", // Yellow-ish
];

export default function NumberCard({
  item,
  index,
  isExplored,
  onSelect,
  isSelected,
}) {
  const [isBouncing, setIsBouncing] = useState(false);
  const bgColor = BG_COLORS[index % BG_COLORS.length];

  const handleClick = () => {
    setIsBouncing(true);
    onSelect(item);
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={`${bgColor} flex flex-col gap-[8px] h-[140px] items-center overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] shrink-0 w-[120px] transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none ${
        isBouncing ? "animate-bounce-custom" : ""
      } ${isSelected ? "ring-4 ring-[#ff6e00] ring-offset-2" : ""}`}
      aria-label={`Number ${item.value}`}
    >
      <div className="flex items-start justify-end overflow-clip relative shrink-0 w-full h-[20px]">
        {isExplored && (
          <span
            className="text-[#ffb800] text-[16px]"
            role="img"
            aria-label="Explored Star"
          >
            ⭐
          </span>
        )}
      </div>
      <p className="font-bold leading-[normal] not-italic relative shrink-0 text-[#1a2640] text-[48px] whitespace-nowrap">
        {item.value}
      </p>
    </button>
  );
}
