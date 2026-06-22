import React, { useState, useEffect } from "react";
import { packageService } from "../services/api";
import ComparisonTable from "../components/packages/ComparisonTable";

export default function ComparePage({ comparedIds, onRemove }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparedPackages = async () => {
      if (comparedIds.length === 0) {
        setPackages([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all packages and filter locally, or fetch individually
        const data = await packageService.getPackages({
          package_ids: comparedIds.join(","),
        });
        setPackages(data.items || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching compared packages:", err);
        setError("Failed to load compared packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparedPackages();
  }, [comparedIds]);

  return (
    <div className="flex-1 p-lg w-full max-w-max-content-width mx-auto">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-2xl font-bold">
          Compare Packages
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Compare prices, durations, and inclusions side-by-side to find your
          perfect trip.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-error bg-error-container/10 rounded-xl p-6 border border-error/20">
          <p>{error}</p>
        </div>
      ) : (
        <ComparisonTable packages={packages} onRemove={onRemove} />
      )}
    </div>
  );
}
