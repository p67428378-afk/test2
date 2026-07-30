import React, { useState } from "react";
import { donationService } from "../services/api";
import Button from "./Button";

export default function CreateDonationForm({ onSuccess }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [foodType, setFoodType] = useState("");
  const [bestBeforeDt, setBestBeforeDt] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!description || !quantity || !bestBeforeDt) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        description,
        quantity,
        food_type: foodType || null,
        best_before_dt: new Date(bestBeforeDt).toISOString(),
        pickup_location: pickupLocation || null,
      };
      await donationService.createDonation(payload);
      setSuccess(true);
      setDescription("");
      setQuantity("");
      setFoodType("");
      setBestBeforeDt("");
      setPickupLocation("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to create donation. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Create New Donation
      </h3>

      {error && (
        <div
          className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
          Donation posted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            Food Item/Description *
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., 10 Large Pizzas"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Quantity *
            </label>
            <input
              id="quantity"
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 10 meals, 5 kg"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="foodType"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Food Type
            </label>
            <input
              id="foodType"
              type="text"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              placeholder="e.g., Veg, Non-Veg, Bakery"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="bestBeforeDt"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Best Before Date & Time *
            </label>
            <input
              id="bestBeforeDt"
              type="datetime-local"
              value={bestBeforeDt}
              onChange={(e) => setBestBeforeDt(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="pickupLocation"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Pickup Location
            </label>
            <input
              id="pickupLocation"
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g., 123 Main St, Pizzeria"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Posting..." : "Post Donation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
