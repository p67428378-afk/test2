import React from "react";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";

export default function ItemCatalogTable({
  items = [],
  inventory = [],
  warehouses = [],
  onEditClick,
  onDeleteClick,
  canManage = false,
  canDelete = false,
}) {
  // Helper to get stock level for an item in a specific warehouse
  const getStock = (itemId, warehouseId) => {
    const record = inventory.find(
      (r) => r.item_id === itemId && r.warehouse_id === warehouseId,
    );
    return record ? record.current_stock : 0;
  };

  // Helper to get total stock across all warehouses
  const getTotalStock = (itemId) => {
    return inventory
      .filter((r) => r.item_id === itemId)
      .reduce((sum, r) => sum + r.current_stock, 0);
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm w-full overflow-hidden">
      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-[#707a8c]">
            No items found matching the filters.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-[#707a8c] uppercase border-b border-[#e3e8f0]">
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                {warehouses.map((wh) => (
                  <th key={wh.id} className="px-6 py-3 text-right">
                    {wh.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-right">Total Stock</th>
                <th className="px-6 py-3 text-right">Threshold</th>
                {(canManage || canDelete) && (
                  <th className="px-6 py-3 text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f0] text-sm">
              {items.map((item) => {
                const totalStock = getTotalStock(item.id);
                const isLowStock = totalStock < item.reorder_threshold;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      ${item.unit_price.toFixed(2)}
                    </td>
                    {warehouses.map((wh) => {
                      const stock = getStock(item.id, wh.id);
                      return (
                        <td
                          key={wh.id}
                          className="px-6 py-4 text-right text-gray-700"
                        >
                          {stock}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isLowStock && (
                          <AlertTriangle
                            className="h-4 w-4 text-red-500"
                            title="Low Stock Alert"
                          />
                        )}
                        <span
                          className={`font-bold ${
                            isLowStock ? "text-red-600" : "text-gray-900"
                          }`}
                        >
                          {totalStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {item.reorder_threshold}
                    </td>
                    {(canManage || canDelete) && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {canManage && (
                            <button
                              onClick={() => onEditClick(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Item"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => onDeleteClick(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
