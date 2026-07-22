import React, { useEffect, useState } from "react";
import ComponentsTable from "../components/equipment/ComponentsTable.jsx";
import {
  componentService,
  inspectionService,
  authService,
} from "../services/api";
import { Plus, X, Calendar, AlertCircle } from "lucide-react";

export default function ComponentsPage() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Available");
  const [inventoryCount, setInventoryCount] = useState(0);
  const [flaggedForReview, setFlaggedForReview] = useState(false);
  const [supervisorApproved, setSupervisorApproved] = useState(false);

  // Inspection form states
  const [eventType, setEventType] = useState("Inspection");
  const [scheduledDate, setScheduledDate] = useState("");

  const user = authService.getCurrentUser();
  const canModify = user?.role === "Engineer" || user?.role === "Admin";

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const data = await componentService.list();
      setComponents(data);
    } catch (err) {
      setError("Failed to load components.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedComponent(null);
    setName("");
    setDescription("");
    setLocation("");
    setStatus("Available");
    setInventoryCount(0);
    setFlaggedForReview(false);
    setSupervisorApproved(false);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleOpenEditModal = (component) => {
    setSelectedComponent(component);
    setName(component.name);
    setDescription(component.description || "");
    setLocation(component.location);
    setStatus(component.status);
    setInventoryCount(component.inventory_count);
    setFlaggedForReview(component.flagged_for_review || false);
    setSupervisorApproved(component.supervisor_approved || false);
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleOpenInspectionModal = (component) => {
    setSelectedComponent(component);
    setEventType("Inspection");
    setScheduledDate("");
    setError("");
    setSuccess("");
    setShowInspectionModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this component?")) {
      try {
        await componentService.delete(id);
        setSuccess("Component deleted successfully.");
        fetchComponents();
      } catch (err) {
        setError("Failed to delete component.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !location) {
      setError("Name and Location are required.");
      return;
    }

    const payload = {
      name,
      description: description || null,
      location,
      status,
      inventory_count: parseInt(inventoryCount, 10) || 0,
      flagged_for_review: flaggedForReview,
      supervisor_approved: supervisorApproved,
    };

    try {
      if (selectedComponent) {
        await componentService.update(selectedComponent.id, payload);
        setSuccess("Component updated successfully!");
      } else {
        await componentService.create(payload);
        setSuccess("Component created successfully!");
      }
      setShowModal(false);
      fetchComponents();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save component.");
    }
  };

  const handleScheduleInspection = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!scheduledDate) {
      setError("Please select a scheduled date.");
      return;
    }

    try {
      await inspectionService.schedule({
        component_id: selectedComponent.id,
        event_type: eventType,
        scheduled_date: scheduledDate,
      });
      setSuccess("Inspection scheduled successfully!");
      setShowInspectionModal(false);
      fetchComponents();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to schedule inspection.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#dee4e1]">
            Spacecraft Components
          </h2>
          <p className="text-sm text-[#bcc9c6] mt-1">
            Manage spacecraft components, track inventory, and schedule
            inspections.
          </p>
        </div>
        {canModify && (
          <button
            onClick={handleOpenCreateModal}
            className="bg-[#6bd8cb] hover:bg-[#89f5e7] text-[#003732] font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Component
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

      {loading ? (
        <div className="text-center py-12 text-[#bcc9c6]">
          Loading components...
        </div>
      ) : (
        <ComponentsTable
          components={components}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          onViewDetails={handleOpenInspectionModal}
          userRole={user?.role}
        />
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b2120] border border-[#3d4947] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#3d4947] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#dee4e1]">
                {selectedComponent ? "Edit Component" : "Add Component"}
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
                  Component Name *
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
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                    Inventory Count
                  </label>
                  <input
                    type="number"
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(e.target.value)}
                    className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-sm text-[#dee4e1] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flaggedForReview}
                    onChange={(e) => setFlaggedForReview(e.target.checked)}
                    className="rounded bg-[#171d1c] border-[#3d4947] text-[#6bd8cb] focus:ring-[#6bd8cb]"
                  />
                  Flag for Engineering Review
                </label>
                {flaggedForReview && (
                  <label className="flex items-center gap-2 text-sm text-[#dee4e1] cursor-pointer pl-6">
                    <input
                      type="checkbox"
                      checked={supervisorApproved}
                      onChange={(e) => setSupervisorApproved(e.target.checked)}
                      className="rounded bg-[#171d1c] border-[#3d4947] text-[#6bd8cb] focus:ring-[#6bd8cb]"
                    />
                    Supervisor Approved
                  </label>
                )}
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
                  Save Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1b2120] border border-[#3d4947] rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#3d4947] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#dee4e1]">
                Schedule Event
              </h3>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="text-[#bcc9c6] hover:text-[#dee4e1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleScheduleInspection} className="p-6 space-y-4">
              <div className="p-3 bg-[#171d1c] rounded-lg border border-[#3d4947] mb-4">
                <div className="text-xs text-[#bcc9c6] uppercase tracking-wider font-mono">
                  Component
                </div>
                <div className="text-base font-semibold text-[#dee4e1]">
                  {selectedComponent?.name}
                </div>
                <div className="text-xs text-[#bcc9c6]">
                  Location: {selectedComponent?.location}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                >
                  <option value="Inspection">Inspection</option>
                  <option value="Calibration">Calibration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] rounded-lg p-2.5 focus:ring-2 focus:ring-[#6bd8cb] focus:border-[#6bd8cb] outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="bg-[#171d1c] border border-[#3d4947] text-[#dee4e1] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#303635] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#29a195] hover:bg-[#6bd8cb] text-[#00302b] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
