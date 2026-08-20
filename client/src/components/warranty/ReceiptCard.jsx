import React from "react";
import { FileText, Download } from "lucide-react";

export default function ReceiptCard({ receipt }) {
  if (!receipt) {
    return (
      <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
        <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
          Proof of Purchase
        </p>
        <p className="text-sm text-[#707a8c] italic">
          No receipt uploaded for this product.
        </p>
      </div>
    );
  }

  const handleDownload = () => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    window.open(`${baseUrl}${receipt.file_url}`, "_blank");
  };

  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
      <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
        Proof of Purchase
      </p>
      <div className="bg-[#f2f5fa] border border-[#e3e8f0] flex gap-3 items-center p-3 rounded-xl w-full max-w-md shrink-0">
        <FileText className="w-8 h-8 text-[#2663eb] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#171c29] text-sm truncate">
            {receipt.filename}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="bg-white border border-[#e3e8f0] hover:bg-gray-50 transition-colors flex items-center justify-center p-2 rounded-lg shrink-0"
          title="Download Receipt"
        >
          <Download className="w-4 h-4 text-[#171c29]" />
        </button>
      </div>
    </div>
  );
}
