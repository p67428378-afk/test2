import React from "react";
import { Home } from "lucide-react";

export default function WarehouseDistribution({
  warehouses = [],
  inventory = [],
}) {
  // Calculate stock per warehouse
  const distribution = warehouses.map((wh) => {
    const whInventory = inventory.filter((rec) => rec.warehouse_id === wh.id);
    const totalStock = whInventory.reduce(
      (sum, rec) => sum + rec.current_stock,
      0,
    );
    const uniqueItems = whInventory.filter(
      (rec) => rec.current_stock > 0,
    ).length;
    return {
      id: wh.id,
      name: wh.name,
      location: wh.location,
      totalStock,
      uniqueItems,
    };
  });

  const grandTotalStock = distribution.reduce(
    (sum, wh) => sum + wh.totalStock,
    0,
  );

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm w-full overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e3e8f0] flex items-center gap-2">
        <Home className="h-5 w-5 text-purple-500" />
        <h3 className="font-bold text-lg text-[#0f172a]">
          Warehouse Stock Distribution
        </h3>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {distribution.map((wh) => {
            const percentage =
              grandTotalStock > 0 ? (wh.totalStock / grandTotalStock) * 100 : 0;
            return (
              <div key={wh.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-gray-800">{wh.name}</p>
                    <p className="text-xs text-gray-500">{wh.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {wh.totalStock} units
                    </p>
                    <p className="text-xs text-gray-500">
                      {wh.uniqueItems} active items
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-[#e3e8f0] flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            Grand Total Stock
          </span>
          <span className="text-xl font-bold text-gray-900">
            {grandTotalStock} units
          </span>
        </div>
      </div>
    </div>
  );
}
