import React from "react";
import { CheckCircle2, X } from "lucide-react";

export default function SuccessBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md shadow-sm mb-6 flex items-start justify-between animate-fadeIn">
      <div className="flex space-x-3">
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-green-800">
            Assortment Plan Submitted Successfully
          </h3>
          <p className="text-xs text-green-700 mt-1 font-medium">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-full hover:bg-green-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
