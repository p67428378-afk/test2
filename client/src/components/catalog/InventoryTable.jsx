import React from "react";
import { Edit, Trash2 } from "lucide-react";
import Badge from "../common/Badge";

export default function InventoryTable({ products = [], onEdit, onDelete }) {
  const getConditionVariant = (condition) => {
    const cond = condition?.toLowerCase();
    if (cond === "new") return "success";
    if (cond === "refurbished") return "info";
    return "warning";
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0_1px_3px_rgba(15,23,42,0.08)] overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant bg-[#F1F5F9]">
        <h3 className="font-title-lg text-title-lg text-on-surface">
          Laptop Inventory
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-bright text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-b border-outline-variant">
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                Brand & Model
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                Specs
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap">
                Condition
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">
                Price
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap text-center">
                Stock
              </th>
              <th className="px-6 py-4 font-semibold whitespace-nowrap text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-body-md divide-y divide-outline-variant">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-on-surface-variant"
                >
                  No laptops found in inventory.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-surface-container-low transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-on-surface whitespace-nowrap">
                    {product.brand} {product.model}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                    {product.processor}, {product.ram} RAM, {product.storage}{" "}
                    Storage, {product.gpu}, {product.screen_size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getConditionVariant(product.condition)}>
                      {product.condition}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-on-surface whitespace-nowrap">
                    $
                    {Number(product.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {product.stock_quantity === 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-error font-medium">0</span>
                        <span
                          className="w-2 h-2 rounded-full bg-error"
                          title="Out of Stock"
                        ></span>
                      </div>
                    ) : product.stock_quantity < 3 ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>{product.stock_quantity}</span>
                        <span
                          className="w-2 h-2 rounded-full bg-amber-500"
                          title="Low Stock"
                        ></span>
                      </div>
                    ) : (
                      <span>{product.stock_quantity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-primary hover:text-primary-container p-1"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-error hover:text-on-error-container p-1 ml-2"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
