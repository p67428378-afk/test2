import React, { useState } from "react";
import { ArrowLeftRight, Plus, Minus, AlertCircle } from "lucide-react";
import { inventoryService } from "../../services/api";

export default function AdjustmentForm({
  items = [],
  warehouses = [],
  onSuccess,
}) {
  const [activeTab, setActiveTab] = useState("adjust"); // 'adjust' or 'transfer'
  const [itemId, setItemId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [sourceWarehouseId, setSourceWarehouseId] = useState("");
  const [destinationWarehouseId, setDestinationWarehouseId] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("addition"); // 'addition' or 'reduction'
  const [quantity, setQuantity] = useState(1);
  const [reasonCode, setReasonCode] = useState("NEW_STOCK");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!itemId) return setError("Please select an item.");
    if (!warehouseId) return setError("Please select a warehouse.");
    if (quantity <= 0) return setError("Quantity must be greater than 0.");
    if (!reasonCode) return setError("Please select a reason code.");

    setLoading(true);
    try {
      await inventoryService.adjustStock(
        itemId,
        warehouseId,
        adjustmentType,
        parseInt(quantity),
        reasonCode,
        notes,
      );
      // Reset form
      setQuantity(1);
      setNotes("");
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to record stock adjustment.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!itemId) return setError("Please select an item.");
    if (!sourceWarehouseId)
      return setError("Please select the source warehouse.");
    if (!destinationWarehouseId)
      return setError("Please select the destination warehouse.");
    if (sourceWarehouseId === destinationWarehouseId) {
      return setError("Source and destination warehouses must be different.");
    }
    if (quantity <= 0) return setError("Quantity must be greater than 0.");

    setLoading(true);
    try {
      await inventoryService.transferStock(
        itemId,
        sourceWarehouseId,
        destinationWarehouseId,
        parseInt(quantity),
        notes,
      );
      // Reset form
      setQuantity(1);
      setNotes("");
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to transfer stock.");
    } finally {
      setLoading(false);
    }
  };

  const reasonCodes = [
    { value: "NEW_STOCK", label: "New Stock Arrival" },
    { value: "RECONCILIATION", label: "Inventory Reconciliation" },
    { value: "DAMAGED_GOODS", label: "Damaged Goods" },
    { value: "THEFT_LOSS", label: "Theft or Loss" },
    { value: "RETURNED_GOODS", label: "Returned Goods" },
  ];

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm w-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-[#e3e8f0]">
        <button
          onClick={() => {
            setActiveTab("adjust");
            setError("");
          }}
          className={`flex-1 py-3 text-center font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "adjust"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Record Stock Adjustment
        </button>
        <button
          onClick={() => {
            setActiveTab("transfer");
            setError("");
          }}
          className={`flex-1 py-3 text-center font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "transfer"
              ? "border-purple-600 text-purple-600 bg-purple-50/30"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Transfer Stock
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === "adjust" ? (
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Select Item
                </label>
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">-- Choose Item --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Warehouse Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Warehouse
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">-- Choose Warehouse --</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Adjustment Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Adjustment Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustmentType("addition");
                      setReasonCode("NEW_STOCK");
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      adjustmentType === "addition"
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Addition</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustmentType("reduction");
                      setReasonCode("DAMAGED_GOODS");
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      adjustmentType === "reduction"
                        ? "bg-red-50 border-red-500 text-red-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                    <span>Reduction</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Reason Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Reason Code
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  {reasonCodes.map((code) => (
                    <option key={code.value} value={code.value}>
                      {code.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Notes / Remarks
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide additional context for this adjustment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Recording..." : "Record Adjustment"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Item Select */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Select Item to Transfer
                </label>
                <select
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  required
                >
                  <option value="">-- Choose Item --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Warehouse */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Source Warehouse
                </label>
                <select
                  value={sourceWarehouseId}
                  onChange={(e) => setSourceWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  required
                >
                  <option value="">-- Choose Source --</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transfer Icon */}
              <div className="hidden md:flex items-end justify-center pb-2">
                <ArrowLeftRight className="h-6 w-6 text-purple-500" />
              </div>

              {/* Destination Warehouse */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Destination Warehouse
                </label>
                <select
                  value={destinationWarehouseId}
                  onChange={(e) => setDestinationWarehouseId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  required
                >
                  <option value="">-- Choose Destination --</option>
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Quantity to Transfer
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Notes / Remarks
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide additional context for this transfer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Transferring..." : "Transfer Stock"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
