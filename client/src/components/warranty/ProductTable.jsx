import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../common/Badge";

export default function ProductTable({ products }) {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-[#707a8c]">
        No matching maintenance records found
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-col items-start overflow-x-auto rounded-xl w-full text-sm">
      <table className="min-w-full divide-y divide-[#e3e8f0]">
        <thead className="bg-[#f7fafc]">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#707a8c] uppercase tracking-wider"
            >
              Product Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#707a8c] uppercase tracking-wider"
            >
              Brand
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#707a8c] uppercase tracking-wider"
            >
              Serial Number
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#707a8c] uppercase tracking-wider"
            >
              Purchase Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#707a8c] uppercase tracking-wider"
            >
              Expiry Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#707a8c] uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#e3e8f0]">
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-[#171c29]">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#707a8c]">
                {product.manufacturer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#707a8c]">
                {product.serial_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#707a8c]">
                {product.purchase_date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#707a8c]">
                {product.warranty?.is_lifetime
                  ? "Lifetime"
                  : product.warranty?.expiry_date || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge status={product.warranty?.status || "Active"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
