import React, { useState, useEffect } from "react";
import { getTechnicians } from "../services/api";
import { PlusCircle, AlertCircle } from "lucide-react";

export default function TaskForm({ onSubmit, submitting = false }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_equipment: "",
    priority: "Medium",
    estimated_cost: "",
    due_date: "",
    assigned_to_id: "",
  });

  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTechnicians() {
      try {
        const data = await getTechnicians();
        setTechnicians(data || []);
      } catch (err) {
        console.error("Failed to load technicians:", err);
      }
    }
    loadTechnicians();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!formData.location_equipment.trim()) {
      setError("Equipment or location is required.");
      return;
    }
    if (formData.estimated_cost === "" || Number(formData.estimated_cost) < 0) {
      setError("Estimated cost must be a positive number.");
      return;
    }
    if (!formData.due_date) {
      setError("Task deadline due date is required.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      location_equipment: formData.location_equipment.trim(),
      priority: formData.priority,
      estimated_cost: parseFloat(formData.estimated_cost),
      due_date: new Date(formData.due_date).toISOString(),
      assigned_to_id: formData.assigned_to_id || null,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-6"
    >
      <div className="border-b border-[#e3e8f0] pb-4">
        <h2 className="text-xl font-bold text-[#171c29]">
          Record New Maintenance Task
        </h2>
        <p className="text-sm text-[#707a8c] mt-1">
          Enter equipment maintenance details, set deadlines, and assign
          technicians.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Transformer Inspection at Substation A"
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="location_equipment"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Location / Equipment <span className="text-red-500">*</span>
          </label>
          <input
            id="location_equipment"
            type="text"
            name="location_equipment"
            value={formData.location_equipment}
            onChange={handleChange}
            placeholder="e.g. Substation A - Transformer #3"
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0] bg-white"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="estimated_cost"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Estimated Cost ($) <span className="text-red-500">*</span>
          </label>
          <input
            id="estimated_cost"
            type="number"
            name="estimated_cost"
            step="0.01"
            min="0"
            value={formData.estimated_cost}
            onChange={handleChange}
            placeholder="500.00"
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
            required
          />
        </div>

        <div>
          <label
            htmlFor="due_date"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Deadline Due Date <span className="text-red-500">*</span>
          </label>
          <input
            id="due_date"
            type="datetime-local"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="assigned_to_id"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Assign Technician (Optional)
          </label>
          <select
            id="assigned_to_id"
            name="assigned_to_id"
            value={formData.assigned_to_id}
            onChange={handleChange}
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0] bg-white"
          >
            <option value="">-- Unassigned --</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.full_name} ({tech.email})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-[#171c29] mb-1"
          >
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the maintenance requirements..."
            className="w-full px-3.5 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f40b0]"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#1f40b0] hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          {submitting ? "Creating Task..." : "Record Maintenance Task"}
        </button>
      </div>
    </form>
  );
}
