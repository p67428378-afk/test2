import React, { useEffect, useState } from "react";
import AssignmentForm from "../components/equipment/AssignmentForm.jsx";
import { missionService, componentService, authService } from "../services/api";
import {
  Plus,
  X,
  Globe,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function MissionsPage() {
  const [missions, setMissions] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [missionEquipment, setMissionEquipment] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [launchDate, setLaunchDate] = useState("");
  const [status, setStatus] = useState("Planning");

  const user = authService.getCurrentUser();
  const canModify = user?.role === "Engineer" || user?.role === "Admin";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [missionData, compData] = await Promise.all([
        missionService.list(),
        componentService.list(),
      ]);
      setMissions(missionData);
      setComponents(compData);
    } catch (err) {
      setError("Failed to load missions and components.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setName("");
    setLaunchDate("");
    setStatus("Planning");
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleViewEquipment = async (mission) => {
    setSelectedMission(mission);
    setError("");
    try {
      const equip = await missionService.getEquipment(mission.id);
      setMissionEquipment(equip);
    } catch (err) {
      setError("Failed to load mission equipment.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !launchDate) {
      setError("Name and Launch Date are required.");
      return;
    }

    try {
      await missionService.create({
        name,
        launch_date: launchDate,
        status,
      });
      setSuccess("Mission created successfully!");
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create mission.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#dee4e1]">Space Missions</h2>
          <p className="text-sm text-[#bcc9c6] mt-1">
            Manage space missions and assign spacecraft components to them.
          </p>
        </div>
        {canModify && (
          <button
            onClick={handleOpenCreateModal}
            className="bg-[#6bd8cb] hover:bg-[#89f5e7] text-[#003732] font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Mission
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-[#6bd8cb]/10 border border-[#6bd8cb]/20 text-[#6bd8cb] rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Missions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg p-5">
            <h3 className="text-lg font-semibold text-[#dee4e1] mb-4">
              Active &amp; Planned Missions
            </h3>
            {loading ? (
              <div className="text-center py-8 text-[#bcc9c6]">
                Loading missions...
              </div>
            ) : missions.length === 0 ? (
              <div className="text-center py-8 text-[#bcc9c6]">
                No missions found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    onClick={() => handleViewEquipment(mission)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMission?.id === mission.id
                        ? "bg-[#6bd8cb]/10 border-[#6bd8cb]"
                        : "bg-[#171d1c] border-[#3d4947] hover:border-[#6bd8cb]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-[#dee4e1] text-lg">
                        {mission.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          mission.status === "Active" ||
                          mission.status === "In Progress"
                            ? "bg-[#6bd8cb]/10 text-[#6bd8cb] border-[#6bd8cb]/20"
                            : "bg-[#bcc9c6]/10 text-[#bcc9c6] border-[#bcc9c6]/20"
                        }`}
                      >
                        {mission.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#bcc9c6] font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      Launch: {mission.launch_date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mission Equipment Details */}
          {selectedMission && (
            <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg p-5">
              <h3 className="text-lg font-semibold text-[#dee4e1] mb-4">
                Equipment Assigned to:{" "}
                <span className="text-[#6bd8cb]">{selectedMission.name}</span>
              </h3>
              {missionEquipment.length === 0 ? (
                <div className="text-center py-8 text-[#bcc9c6]">
                  No equipment assigned to this mission yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0a0f0e]/50 border-b border-[#3d4947]">
                        <th className="p-3 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                          Name
                        </th>
                        <th className="p-3 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                          Location
                        </th>
                        <th className="p-3 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-[#3d4947]/50">
                      {missionEquipment.map((comp) => (
                        <tr
                          key={comp.id}
                          className="hover:bg-[#303635] transition-colors"
                        >
                          <td className="p-3 text-[#dee4e1] font-semibold">
                            {comp.name}
                          </td>
                          <td className="p-3 text-[#bcc9c6] font-mono">
                            {comp.location}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-[#6bd8cb]/10 text-[#6bd8cb] border border-[#6bd8cb]/20">
                              {comp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assignment Form */}
        <div>
          <AssignmentForm
            components={components}
            missions={missions}
            onAssignmentSuccess={() => {
              if (selectedMission) {
                handleViewEquipment(selectedMission);
              }
            }}
          />
        </div>
      </div>

      {/* Create Mission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b2120] border border-[#3d4947] rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#3d4947] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#dee4e1]">
                Create Mission
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#bcc9c6] hover:text-[#dee4e1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                  Mission Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                  Launch Date *
                </label>
                <input
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#303635] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#29a195] hover:bg-[#6bd8cb] text-[#00302b] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
