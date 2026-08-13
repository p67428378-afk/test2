import React, { useState } from "react";
import { Calendar, Plus, Music, MapPin, Clock, Filter } from "lucide-react";
import SchedulePerformanceModal from "./SchedulePerformanceModal";

export default function PerformanceScheduleTimeline({
  performances = [],
  artists = [],
  stages = [],
  onRefresh,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStageFilter, setSelectedStageFilter] = useState("");

  const filteredPerformances = selectedStageFilter
    ? performances.filter((p) => p.stage_id === selectedStageFilter)
    : performances;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" /> Multi-Stage Artist
            Schedule
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated conflict detection locks reserved stage slots and prevents
            double-booking.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="" className="bg-slate-900">
                All Festival Stages
              </option>
              {stages.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Slot</span>
          </button>
        </div>
      </div>

      {/* Performances List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPerformances.map((perf) => {
          const artistName = perf.artist?.name || "Artist";
          const artistGenre = perf.artist?.genre || "Genre";
          const stageName = perf.stage?.name || "Stage";
          const zone = perf.stage?.location_zone || "Zone";

          const startTime = new Date(perf.start_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const endTime = new Date(perf.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={perf.id}
              className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg transition space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {artistGenre}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-slate-400" /> {artistName}
                  </h3>
                </div>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold px-2 py-0.5 rounded-full">
                  {perf.status || "SCHEDULED"}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-medium text-white">{stageName}</span>
                  <span className="text-slate-500">({zone})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-slate-200">
                    {startTime} &ndash; {endTime}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPerformances.length === 0 && (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl py-12 text-center text-slate-500 text-sm">
            No performances scheduled for the selected filter.
          </div>
        )}
      </div>

      <SchedulePerformanceModal
        artists={artists}
        stages={stages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
