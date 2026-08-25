import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import FineSearchCard from "../components/fines/FineSearchCard";
import FineDetailsCard from "../components/fines/FineDetailsCard";
import { publicFineService } from "../services/api";
import { Info, HelpCircle } from "lucide-react";

export default function PublicLookupPage() {
  const [searchResults, setSearchResults] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (type, value) => {
    setIsLoading(true);
    setErrorMessage("");
    setSearchResults(null);
    setHasSearched(true);

    try {
      let results = [];
      if (type === "license_plate") {
        results = await publicFineService.searchFines(value, null);
      } else {
        results = await publicFineService.searchFines(null, value);
      }

      if (!results || results.length === 0) {
        setErrorMessage(
          `No parking fine records found for the provided details ("${value}").`,
        );
        setSearchResults([]);
      } else {
        setSearchResults(results);
        // Fetch detailed payment status & overdue penalty for each result
        const statusPromises = results.map(async (f) => {
          try {
            const st = await publicFineService.getFineStatus(f.id);
            return { id: f.id, statusDetails: st };
          } catch {
            return { id: f.id, statusDetails: null };
          }
        });

        const statusRes = await Promise.all(statusPromises);
        const newMap = {};
        statusRes.forEach((item) => {
          newMap[item.id] = item.statusDetails;
        });
        setStatusMap(newMap);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setErrorMessage(
          "No parking fine records found for the provided details.",
        );
      } else {
        setErrorMessage(
          err.response?.data?.detail ||
            "An error occurred while searching for fine records.",
        );
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
            <span>Official Portal</span>
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            City Parking Citation Portal
          </h1>
          <p className="text-sm text-slate-600">
            Look up citations, verify real-time payment status, and review fee
            breakdowns instantly.
          </p>
        </div>

        <FineSearchCard
          onSearch={handleSearch}
          isLoading={isLoading}
          error={errorMessage}
        />

        {hasSearched && searchResults && searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">
                Matching Citations ({searchResults.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Real-time Status Verification Verified
              </span>
            </div>

            {searchResults.map((fine) => (
              <FineDetailsCard
                key={fine.id}
                fine={fine}
                statusDetails={statusMap[fine.id]}
              />
            ))}
          </div>
        )}

        {/* Informational Help Box */}
        <div className="max-w-2xl mx-auto bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-blue-800 text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Citation Payment Guidelines & Info</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>
              Unpaid citations past the due date automatically incur overdue
              penalty fees.
            </li>
            <li>
              Status definitions: <strong>UNPAID</strong> (Pending payment),{" "}
              <strong>PAID</strong> (Cleared), <strong>OVERDUE</strong> (Past
              due), <strong>PENDING VERIFICATION</strong> (Processing),{" "}
              <strong>VOIDED</strong> (Cancelled).
            </li>
            <li>
              For admin inquiries or manual payment clearance verification,
              please contact City Parking Enforcement.
            </li>
          </ul>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            © 2026 City Parking Fine Management System. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
