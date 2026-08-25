import React, { useState } from "react";
import { Search, AlertCircle, RefreshCw, FileText, Car } from "lucide-react";

export default function FineSearchCard({ onSearch, isLoading, error }) {
  const [searchType, setSearchType] = useState("license_plate"); // 'license_plate' or 'ticket_number'
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    onSearch(searchType, searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">
          Parking Citation Search & Verification
        </h2>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        Search for outstanding or historical parking citations by License Plate
        or Citation Ticket Reference Number.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex rounded-lg p-1 bg-slate-100 max-w-md border border-slate-200">
          <button
            type="button"
            onClick={() => setSearchType("license_plate")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-md transition-all ${
              searchType === "license_plate"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>License Plate</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchType("ticket_number")}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-md transition-all ${
              searchType === "ticket_number"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ticket Reference #</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            {searchType === "license_plate"
              ? "Vehicle License Plate Number"
              : "Citation Ticket Reference Number"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === "license_plate"
                  ? "e.g. ABC-1234"
                  : "e.g. FN-98765"
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 placeholder-slate-400 font-medium"
              required
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || !searchValue.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search Fines</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
