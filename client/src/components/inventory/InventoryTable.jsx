import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export default function InventoryTable({ items = [], onEdit, onDelete }) {
  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-outline-variant/30">
        <h2 className="text-lg font-semibold text-on-surface">Inventory &amp; Materials</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20">
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Product Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Description</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Cost ($)</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Price ($)</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Stock Qty</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface">
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-on-surface-variant">
                  No inventory items found.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isLowStock = item.stock_quantity <= 10;
                return (
                  <tr key={item.product_id} className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors">
                    <td className="py-3 px-6 font-medium text-on-surface">{item.name}</td>
                    <td className="py-3 px-6 text-on-surface-variant max-w-xs truncate">{item.description || '-'}</td>
                    <td className="py-3 px-6 text-right">${parseFloat(item.cost || 0).toFixed(2)}</td>
                    <td className="py-3 px-6 text-right">${parseFloat(item.price || 0).toFixed(2)}</td>
                    <td className="py-3 px-6 text-right font-semibold">{item.stock_quantity}</td>
                    <td className="py-3 px-6">
                      <Badge variant={isLowStock ? 'warning' : 'success'}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit && onEdit(item)}
                          className="p-1 text-on-surface-variant hover:text-brand-indigo transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(item.product_id)}
                          className="p-1 text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}