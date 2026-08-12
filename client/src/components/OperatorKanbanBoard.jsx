import React, { useState } from "react";
import { WashingMachine, AlertCircle, ArrowRight, Save } from "lucide-react";
import { ordersAPI } from "../services/api";

const COLUMNS = [
  {
    id: "intake",
    title: "Intake & Sorting",
    stages: ["Received", "Sorting", "SPECIAL_PROCESSING"],
  },
  {
    id: "processing",
    title: "Washing & Processing",
    stages: ["Washing", "Drying", "Ironing"],
  },
  {
    id: "dispatch",
    title: "Ready for Dispatch",
    stages: ["Ready_for_Delivery", "Out for Delivery", "DELIVERED"],
  },
];

export default function OperatorKanbanBoard({ orders = [], onOrderUpdated }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [nextStage, setNextStage] = useState("Sorting");
  const [weightKg, setWeightKg] = useState("");
  const [itemCount, setItemCount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleOpenStageModal = (order) => {
    setSelectedOrder(order);
    setNextStage(order.status || "Sorting");
    setWeightKg(order.weight_kg || "");
    setItemCount(order.item_count || "");
    setNotes("");
    setError(null);
    setSuccess(null);
  };

  const handleUpdateStage = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        stage: nextStage,
        notes: notes || undefined,
        weight_kg: weightKg ? Number(weightKg) : undefined,
        item_count: itemCount ? Number(itemCount) : undefined,
      };

      const updated = await ordersAPI.updateStage(selectedOrder.id, payload);
      setSuccess(`Order stage updated to ${nextStage}!`);
      if (onOrderUpdated) {
        onOrderUpdated(updated);
      }
      setTimeout(() => setSelectedOrder(null), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to update order stage.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <WashingMachine className="h-5 w-5 text-blue-600" />
            <span>Operator Washing & Stage Management Board</span>
          </h2>
          <p className="text-xs text-slate-500">
            Advance orders through lifecycle stages and log weighed garments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const columnOrders = orders.filter((o) =>
            col.stages.includes(o.status),
          );

          return (
            <div
              key={col.id}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-slate-800">
                  {col.title}
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full">
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {columnOrders.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                    No active orders
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-bold text-blue-600">
                          #{order.id?.slice(0, 8)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            order.status === "SPECIAL_PROCESSING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 mb-3">
                        <p>
                          <span className="font-semibold text-slate-700">
                            Service:
                          </span>{" "}
                          {order.service_type}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-700">
                            Weight:
                          </span>{" "}
                          {order.weight_kg || 0} kg
                        </p>
                      </div>

                      <button
                        onClick={() => handleOpenStageModal(order)}
                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Update Stage</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
              Update Stage for Order #{selectedOrder.id?.slice(0, 8)}
            </h3>

            {error && (
              <div
                className="p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center space-x-2"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">
                {success}
              </div>
            )}

            <form onSubmit={handleUpdateStage} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Lifecycle Stage
                </label>
                <select
                  value={nextStage}
                  onChange={(e) => setNextStage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Received">Received</option>
                  <option value="Sorting">Sorting</option>
                  <option value="SPECIAL_PROCESSING">
                    SPECIAL_PROCESSING (Special Care)
                  </option>
                  <option value="Washing">Washing</option>
                  <option value="Drying">Drying</option>
                  <option value="Ironing">Ironing</option>
                  <option value="Ready_for_Delivery">Ready for Delivery</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Actual Measured Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 6.5"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Item Count
                </label>
                <input
                  type="number"
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Operator Notes / Garment Flags
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Silk shirt flagged for gentle wash"
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                  rows="2"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-1/2 py-2 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Saving..." : "Save Stage"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
