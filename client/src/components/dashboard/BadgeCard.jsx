import React from "react";
import { Lock } from "lucide-react";

export default function BadgeCard({ name, icon, isUnlocked, requirement }) {
  return (
    <div
      className={`flex-none w-48 bg-white border-2 border-slate-200 rounded-xl p-4 flex flex-col items-center text-center snap-start ${!isUnlocked ? "opacity-75 grayscale" : ""}`}
    >
      <div
        className={`w-24 h-24 mb-4 rounded-full flex items-center justify-center sticker-badge text-4xl ${isUnlocked ? "bg-amber-100 rotate-3" : "bg-slate-200"}`}
      >
        {isUnlocked ? icon : <Lock className="text-slate-400" size={32} />}
      </div>
      <span className="font-bold text-slate-800 mb-1">{name}</span>
      {isUnlocked ? (
        <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
          Unlocked
        </span>
      ) : (
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md mt-1 leading-tight">
          {requirement}
        </span>
      )}
    </div>
  );
}
