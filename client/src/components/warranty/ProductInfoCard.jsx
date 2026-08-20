import React from "react";
import Badge from "../common/Badge";

export default function ProductInfoCard({ product }) {
  if (!product) return null;

  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
      <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
        Product Information
      </p>
      <div className="flex flex-col gap-2 items-start text-[#171c29] w-full text-sm">
        <p className="font-bold text-base">Product Name: {product.name}</p>
        <p className="font-normal">Brand: {product.manufacturer}</p>
        <p className="font-normal">Serial Number: {product.serial_number}</p>
        <p className="font-normal">Purchase Date: {product.purchase_date}</p>
        <p className="font-normal">
          Warranty Duration:{" "}
          {product.warranty?.is_lifetime
            ? "Lifetime"
            : `${product.warranty?.duration_months || 0} Months`}
        </p>
        <p className="font-normal">
          Expiry Date:{" "}
          {product.warranty?.is_lifetime
            ? "Lifetime"
            : product.warranty?.expiry_date || "N/A"}
        </p>
      </div>
      <div className="flex gap-2 items-center w-full shrink-0 pt-2 border-t border-[#e3e8f0]">
        <p className="font-medium text-[#707a8c] text-sm whitespace-nowrap">
          Warranty Status:
        </p>
        <Badge status={product.warranty?.status || "Active"} />
      </div>
    </div>
  );
}
