import React, { useState } from "react";
import { Plus, AlertCircle, CheckCircle } from "lucide-react";
import { donationApi } from "../../services/api";

export default function DonationForm({ onDonationCreated }) {
  const [formData, setFormData] = useState({
    category: "Cooked Meals",
    quantity: 10,
    preparation_time: new Date().toISOString().slice(0, 16),
    storage_condition: "REFRIGERATED",
    pickup_address: "123 Main St, Restaurant Row",
    estimated_shelf_life: 6,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "estimated_shelf_life"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        preparation_time: new Date(formData.preparation_time).toISOString(),
      };
      const response = await donationApi.createDonation(payload);
      setSuccess(true);
      if (onDonationCreated) {
        onDonationCreated(response);
      }
      // Reset form
      setFormData({
        category: "Cooked Meals",
        quantity: 10,
        preparation_time: new Date().toISOString().slice(0, 16),
        storage_condition: "REFRIGERATED",
        pickup_address: "123 Main St, Restaurant Row",
        estimated_shelf_life: 6,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to post food donation. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
        <Plus className="h-5 w-5 text-emerald-600" />
        <span>Post Surplus Food Donation</span>
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <span>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>Surplus food donation posted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Food Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Baked Goods">Baked Goods</option>
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Dairy & Beverages">Dairy & Beverages</option>
              <option value="Packaged Foods">Packaged Foods</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity (kg / servings)
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              step="0.5"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Preparation Time
            </label>
            <input
              type="datetime-local"
              name="preparation_time"
              value={formData.preparation_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Storage Condition
            </label>
            <select
              name="storage_condition"
              value={formData.storage_condition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="REFRIGERATED">Refrigerated</option>
              <option value="HEATED">Heated</option>
              <option value="AMBIENT">Ambient Room Temp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Estimated Shelf Life (Hours)
            </label>
            <input
              type="number"
              name="estimated_shelf_life"
              min="1"
              max="72"
              value={formData.estimated_shelf_life}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Pickup Address
            </label>
            <input
              type="text"
              name="pickup_address"
              value={formData.pickup_address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? <span>Posting...</span> : <span>Post Donation</span>}
        </button>
      </form>
    </div>
  );
}
