import React from "react";

export default function ModuleCard({
  title,
  description,
  icon,
  bgColor,
  borderColor,
  textColor,
  btnColor,
  btnBorderColor,
  btnText,
  onPlay,
}) {
  return (
    <article
      className={`rounded-xl p-8 flex flex-col items-center text-center shadow-lg border-2 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 cursor-pointer`}
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
      onClick={onPlay}
    >
      <div className="w-32 h-32 mb-6 rounded-full bg-white/50 flex items-center justify-center sticker-badge group-hover:rotate-6 transition-transform text-6xl">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
        {title}
      </h3>
      <p className="text-lg mb-8 flex-grow" style={{ color: textColor }}>
        {description}
      </p>
      <button
        className="text-white font-bold py-3 px-6 rounded-xl w-full chunky-button"
        style={{ backgroundColor: btnColor, borderBottomColor: btnBorderColor }}
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
      >
        {btnText}
      </button>
    </article>
  );
}
