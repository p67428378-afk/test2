import React, { useState, useEffect } from "react";
import { expeditionService, scheduleService } from "../services/api.js";
import CrewList from "../components/expeditions/CrewList.jsx";
import SampleTable from "../components/expeditions/SampleTable.jsx";

export default function ExpeditionsPage() {
  const [expeditions, setExpeditions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [researchGoals, setResearchGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpeditions();
    fetchSchedules();
  }, []);

  const fetchExpeditions = async () => {
    try {
      setLoading(true);
      const data = await expeditionService.getExpeditions();
      setExpeditions(data);
      if (data.length > 0 && !selectedExpedition) {
        setSelectedExpedition(data[0]);
      }
    } catch (err) {
      console.error("Error fetching expeditions:", err);
      setError("Failed to load expeditions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await scheduleService.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  const handleCreateExpedition = async (e) => {
    e.preventDefault();
    if (!name || !scheduleId || !startDate || !endDate || !researchGoals) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError("");
      const newExpedition = await expeditionService.createExpedition({
        name,
        schedule_id: scheduleId,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        research_goals: researchGoals,
      });
      setName("");
      setScheduleId("");
      setStartDate("");
      setEndDate("");
      setResearchGoals("");
      setIsFormOpen(false);
      fetchExpeditions();
      setSelectedExpedition(newExpedition);
    } catch (err) {
      console.error("Error creating expedition:", err);
      setError("Failed to create expedition. Please check your inputs.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">
            Scientific Expeditions
          </h2>
          <p className="text-sm text-on-surface-variant">
            Plan expeditions, assign crew, and log research samples.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-bold px-4 py-2 rounded hover:bg-primary-container transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Expedition
        </button>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error text-error p-4 rounded text-sm">
          {error}
        </div>
      )}

      {isFormOpen && (
        <form
          onSubmit={handleCreateExpedition}
          className="bg-surface-container p-6 rounded-lg border border-white/10 space-y-4"
        >
          <h3 className="text-lg font-bold text-primary">
            Create Scientific Expedition
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Expedition Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Linked Vessel Schedule *
              </label>
              <select
                value={scheduleId}
                onChange={(e) => setScheduleId(e.target.value)}
                className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                required
              >
                <option value="">Select a schedule...</option>
                {schedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.vessel_name} - {s.route} ({formatDate(s.start_date)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Start Date *
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Research Goals *
            </label>
            <textarea
              value={researchGoals}
              onChange={(e) => setResearchGoals(e.target.value)}
              rows={3}
              className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-outline-variant text-on-surface rounded hover:bg-surface-variant/30 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary font-bold rounded hover:bg-primary-container text-sm transition-colors"
            >
              Create Expedition
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Expedition List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            Expeditions
          </h3>
          {loading ? (
            <p className="text-sm text-on-surface-variant">Loading...</p>
          ) : (
            <div className="space-y-2">
              {expeditions.map((exp) => {
                const isSelected = selectedExpedition?.id === exp.id;
                return (
                  <div
                    key={exp.id}
                    onClick={() => setSelectedExpedition(exp)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-primary-container/20 border-primary text-on-surface"
                        : "bg-surface-container border-white/5 text-on-surface-variant hover:border-white/10"
                    }`}
                  >
                    <h4 className="font-bold text-sm truncate">{exp.name}</h4>
                    <p className="text-xs mt-1 opacity-80">
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </p>
                  </div>
                );
              })}
              {expeditions.length === 0 && (
                <p className="text-sm text-on-surface-variant italic">
                  No expeditions found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Expedition Details, Crew, and Samples */}
        <div className="lg:col-span-8 space-y-6">
          {selectedExpedition ? (
            <>
              <div className="glass-panel rounded-lg p-6 card-top-border-primary">
                <h3 className="text-xl font-bold text-on-surface">
                  {selectedExpedition.name}
                </h3>
                <p className="text-sm text-on-surface-variant mt-1">
                  Timeline: {formatDate(selectedExpedition.start_date)} -{" "}
                  {formatDate(selectedExpedition.end_date)}
                </p>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Research Goals
                  </h4>
                  <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">
                    {selectedExpedition.research_goals}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CrewList expeditionId={selectedExpedition.id} />
                <SampleTable expeditionId={selectedExpedition.id} />
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-lg p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">
                explore
              </span>
              <p>
                Select an expedition to view details, manage crew, and log
                samples.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
