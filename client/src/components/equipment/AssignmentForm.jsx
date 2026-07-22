import React, { useState } from "react";
import { missionService } from "../../services/api";

export default function AssignmentForm({
  components = [],
  missions = [],
  onAssignmentSuccess,
}) {
  const [selectedMission, setSelectedMission] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedMission || !selectedComponent) {
      setError("Please select both a mission and a component.");
      return;
    }

    const component = components.find((c) => c.id === selectedComponent);
    if (!component) {
      setError("Selected component not found.");
      return;
    }

    // Validation rules:
    // 1. Cannot assign if out of service
    if (component.status === "Out of Service") {
      setError("Cannot assign out-of-service equipment to a mission.");
      return;
    }

    // 2. Cannot assign if flagged for review and not supervisor approved
    if (component.flagged_for_review && !component.supervisor_approved) {
      setError(
        "Components flagged for engineering review require supervisor approval before assignment.",
      );
      return;
    }

    setLoading(true);
    try {
      await missionService.assignEquipment(selectedMission, selectedComponent);
      setSuccess("Equipment successfully assigned to mission!");
      setSelectedComponent("");
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to assign equipment to mission.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg p-6">
      <h3 className="text-lg font-semibold text-[#dee4e1] mb-4">
        Assign Equipment to Mission
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-[#6bd8cb]/10 border border-[#6bd8cb]/20 text-[#6bd8cb] rounded text-sm">
            {success}
          </div>
        )}

        <div>
          <label
            htmlFor="mission-select"
            className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2"
          >
            Select Mission
          </label>
          <select
            id="mission-select"
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
          >
            <option value="">-- Select Mission --</option>
            {missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.name} ({mission.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="component-select"
            className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2"
          >
            Select Component
          </label>
          <select
            id="component-select"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
          >
            <option value="">-- Select Component --</option>
            {components.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name} - {comp.status}{" "}
                {comp.flagged_for_review && !comp.supervisor_approved
                  ? "(Pending Review)"
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#29a195] hover:bg-[#6bd8cb] text-[#00302b] font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Equipment"}
        </button>
      </form>
    </div>
  );
}
