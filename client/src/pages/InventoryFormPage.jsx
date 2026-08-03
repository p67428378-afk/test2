import React, { useState, useEffect } from "react";
import InventoryForm from "../components/inventory/InventoryForm.jsx";
import { inventoryService } from "../services/api.js";
import { ArrowLeft } from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function InventoryFormPage({ itemId, onCancel, onSave }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        setLoading(true);
        setError("");
        try {
          const data = await inventoryService.getInventoryItem(itemId);
          setItem(data);
        } catch (err) {
          setError("Failed to load item details. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [itemId]);

  const handleSave = async (formData) => {
    setSubmitting(true);
    setError("");
    try {
      if (itemId) {
        await inventoryService.updateInventoryItem(itemId, formData);
      } else {
        await inventoryService.createInventoryItem(formData);
      }
      onSave();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to save inventory item. Please check your inputs.",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onCancel} className="p-2">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Button>
        <h2 className="text-xl font-bold text-slate-100">
          {itemId ? "Edit Inventory Item" : "Add New Inventory Item"}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">Loading item details...</p>
        </div>
      ) : (
        <InventoryForm
          initialData={item}
          onSave={handleSave}
          onCancel={onCancel}
          isSubmitting={submitting}
        />
      )}
    </div>
  );
}
