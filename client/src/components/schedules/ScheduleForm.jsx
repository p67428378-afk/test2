import React, { useState, useEffect } from "react";

export default function ScheduleForm({ schedule, onSubmit, onCancel }) {
  const [vesselName, setVesselName] = useState("");
  const [route, setRoute] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [destinationPort, setDestinationPort] = useState("");
  const [status, setStatus] = useState("Planned");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (schedule) {
      setVesselName(schedule.vessel_name || "");
      setRoute(schedule.route || "");
      setStartDate(
        schedule.start_date ? schedule.start_date.substring(0, 16) : "",
      );
      setEndDate(schedule.end_date ? schedule.end_date.substring(0, 16) : "");
      setDestinationPort(schedule.destination_port || "");
      setStatus(schedule.status || "Planned");
      setNotes(schedule.notes || "");
    } else {
      setVesselName("");
      setRoute("");
      setStartDate("");
      setEndDate("");
      setDestinationPort("");
      setStatus("Planned");
      setNotes("");
    }
    setError("");
  }, [schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vesselName || !route || !startDate || !endDate || !destinationPort) {
      setError("Please fill in all required fields.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date.");
      return;
    }

    onSubmit({
      vessel_name: vesselName,
      route,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
      destination_port: destinationPort,
      status,
      notes,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-surface-container p-6 rounded-lg border border-white/10"
    >
      <h3 className="text-lg font-bold text-primary mb-4">
        {schedule ? "Edit Vessel Schedule" : "Create Vessel Schedule"}
      </h3>

      {error && (
        <div className="bg-error-container/20 border border-error text-error p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Vessel Name *
          </label>
          <input
            type="text"
            value={vesselName}
            onChange={(e) => setVesselName(e.target.value)}
            className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Destination Port (UN/LOCODE) *
          </label>
          <input
            type="text"
            value={destinationPort}
            onChange={(e) => setDestinationPort(e.target.value)}
            maxLength={10}
            className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-on-surface-variant mb-1">
          Route *
        </label>
        <input
          type="text"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
          required
        />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
          >
            <option value="Planned">Planned</option>
            <option value="Underway">Underway</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-on-surface-variant mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-outline-variant text-on-surface rounded hover:bg-surface-variant/30 text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-on-primary font-bold rounded hover:bg-primary-container text-sm transition-colors"
        >
          {schedule ? "Update Schedule" : "Create Schedule"}
        </button>
      </div>
    </form>
  );
}
