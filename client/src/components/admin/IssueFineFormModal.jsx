import React, { useState } from "react";
import { PlusCircle, X, AlertCircle, RefreshCw } from "lucide-react";

export default function IssueFineFormModal({ isOpen, onClose, onSubmit }) {
  const [licensePlate, setLicensePlate] = useState("");
  const [violationType, setViolationType] = useState("Overtime Parking");
  const [location, setLocation] = useState("Zone 4 - Main St");
  const [amount, setAmount] = useState("35.00");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !licensePlate.trim() ||
      !violationType.trim() ||
      !location.trim() ||
      !amount ||
      !dueDate
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError("Fine amount must be a positive number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        license_plate: licensePlate.trim().toUpperCase(),
        violation_type: violationType.trim(),
        location: location.trim(),
        amount: numericAmount,
        due_date: new Date(dueDate).toISOString(),
      });
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setFormError(
        err.response?.data?.detail || "Failed to issue new parking citation.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl border border-slate-200">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Issue New Parking Citation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1 uppercase tracking-wider">
              Vehicle License Plate Number{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="e.g. XYZ-5678"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Violation Type <span className="text-red-500">*</span>
              </label>
              <select
                value={violationType}
                onChange={(e) => setViolationType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="Overtime Parking">Overtime Parking</option>
                <option value="No Parking Zone">No Parking Zone</option>
                <option value="Expired Meter">Expired Meter</option>
                <option value="Fire Hydrant Blocking">
                  Fire Hydrant Blocking
                </option>
                <option value="Handicap Space Violation">
                  Handicap Space Violation
                </option>
                <option value="Double Parking">Double Parking</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fine Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="35.00"
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Violation Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Zone 4 - Main St & 5th Ave"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Payment Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Issuing...</span>
                </>
              ) : (
                <span>Issue Citation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
