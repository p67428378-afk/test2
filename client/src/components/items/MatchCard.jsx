import React from "react";
import { MapPin, Calendar, ArrowRightLeft, Percent } from "lucide-react";
import Button from "../common/Button.jsx";

export default function MatchCard({ match, lostItem, onClaim }) {
  const scorePercent = Math.round(match.score * 100);
  const foundItem = match.item;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" />
            {scorePercent}% Match
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Match ID: #{foundItem.id?.substring(0, 8)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 relative">
        {/* Divider line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2"></div>
        <div className="absolute left-1/2 top-1/2 w-6 h-6 rounded-full bg-[#1E293B] border border-slate-800 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10 text-slate-400">
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </div>

        {/* Lost Side */}
        <div className="pr-4">
          <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
            Your Report (Lost)
          </span>
          <p className="text-sm font-semibold text-white">{lostItem.name}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lostItem.location_text}</span>
          </div>
        </div>

        {/* Found Side */}
        <div className="pl-4">
          <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
            Found Item
          </span>
          <p className="text-sm font-semibold text-white">{foundItem.name}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{foundItem.location_text}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button
          onClick={() => onClaim(foundItem)}
          variant="primary"
          className="text-xs py-1.5"
        >
          Claim Item
        </Button>
      </div>
    </div>
  );
}
