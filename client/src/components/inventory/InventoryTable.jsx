import React from "react";
import Badge from "../common/Badge.jsx";
import Button from "../common/Button.jsx";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";

export default function InventoryTable({
  items,
  onEdit,
  onDelete,
  isLibrarian,
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-xl">
        <p className="text-slate-400 text-sm">No items found</p>
      </div>
    );
  }

  const getStatusBadge = (item) => {
    if (item.quantity === 0) {
      return <Badge variant="danger">Out of Stock</Badge>;
    }
    if (item.is_low_stock || item.quantity <= item.low_stock_threshold) {
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Low Stock
        </Badge>
      );
    }
    return <Badge variant="success">In Stock</Badge>;
  };

  return (
    <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase bg-slate-900/50">
            <th className="p-4">Item Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Quantity</th>
            <th className="p-4">Supplier</th>
            <th className="p-4">Status</th>
            {isLibrarian && <th className="p-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 text-sm text-slate-300">
          {items.map((item) => (
            <tr
              key={item.item_id}
              className="hover:bg-slate-700/30 transition-colors"
            >
              <td className="p-4">
                <div>
                  <p className="font-semibold text-slate-100">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                  {item.category || "Uncategorized"}
                </span>
              </td>
              <td className="p-4 font-medium">
                {item.quantity}{" "}
                <span className="text-xs text-slate-500">{item.unit}</span>
              </td>
              <td className="p-4 text-slate-400">{item.supplier || "N/A"}</td>
              <td className="p-4">{getStatusBadge(item)}</td>
              {isLibrarian && (
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      className="p-1.5 text-slate-400 hover:text-emerald-400"
                      onClick={() => onEdit(item.item_id)}
                      title="Edit Item"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="p-1.5 text-slate-400 hover:text-rose-400"
                      onClick={() => onDelete(item.item_id)}
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
