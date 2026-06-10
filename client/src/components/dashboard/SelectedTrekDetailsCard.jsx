import React from 'react';
import { Compass, Backpack, CheckCircle } from 'lucide-react';

function SelectedTrekDetailsCard() {
  return (
    <aside className="bg-[#1E293B] border border-[#334155] rounded-[16px] overflow-hidden sticky top-[88px]">
      {/* Cover Image Placeholder */}
      <div className="h-32 bg-gradient-to-br from-surface-dim to-surface-container border-b border-[#334155] relative flex items-center justify-center">
        <Compass className="w-12 h-12 text-on-surface-variant opacity-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 inline-block">Selected Trek</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Everest Base Camp Trek</h2>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            Lukla to EBC
          </p>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <span className="text-on-surface-variant font-body-md text-sm">Duration</span>
            <span className="text-on-surface font-label-md text-sm font-semibold">14 Days</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <span className="text-on-surface-variant font-body-md text-sm">Difficulty</span>
            <span className="text-error font-label-md text-sm font-semibold bg-error/10 px-2 py-0.5 rounded">Difficult</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <span className="text-on-surface-variant font-body-md text-sm">Max Elevation</span>
            <span className="text-on-surface font-label-md text-sm font-semibold">5,364 m</span>
          </div>
        </div>
        {/* Required Equipment */}
        <div>
          <h4 className="font-label-md text-label-md text-on-surface mb-3 flex items-center gap-2">
            <Backpack className="w-4 h-4 text-primary" /> Required Equipment
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm">
              <CheckCircle className="w-4 h-4 text-primary" /> Sleeping bag (-15C)
            </li>
            <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm">
              <CheckCircle className="w-4 h-4 text-primary" /> Trekking poles
            </li>
            <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm">
              <CheckCircle className="w-4 h-4 text-primary" /> Crampons (Micro-spikes)
            </li>
            <li className="flex items-center gap-2 text-on-surface-variant font-body-md text-sm">
              <CheckCircle className="w-4 h-4 text-primary" /> Heavy down jacket
            </li>
          </ul>
          <button className="w-full mt-4 bg-transparent border border-outline-variant text-on-surface py-2 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors">
            View Full Itinerary
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SelectedTrekDetailsCard;
