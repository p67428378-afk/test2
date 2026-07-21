import React, { useState, useEffect } from "react";
import { sampleService } from "../../services/api.js";

export default function SampleTable({ expeditionId }) {
  const [samples, setSamples] = useState([]);
  const [sampleType, setSampleType] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (expeditionId) {
      fetchSamples();
    }
  }, [expeditionId]);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      const data = await sampleService.getSamples({
        expedition_id: expeditionId,
      });
      setSamples(data);
    } catch (err) {
      console.error("Error fetching samples:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSample = async (e) => {
    e.preventDefault();
    if (!sampleType || !collectionDate || !storageLocation) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setError("");
      await sampleService.createSample({
        expedition_id: expeditionId,
        sample_type: sampleType,
        collection_date: new Date(collectionDate).toISOString(),
        storage_location: storageLocation,
        notes: notes || null,
      });
      setSampleType("");
      setCollectionDate("");
      setStorageLocation("");
      setNotes("");
      fetchSamples();
    } catch (err) {
      console.error("Error logging sample:", err);
      setError("Failed to log sample. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-lg p-6">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">science</span>
          Research Samples
        </h3>

        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading samples...</p>
        ) : samples.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">
            No samples logged for this expedition yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-on-surface-variant/70 border-b border-white/10">
                  <th className="pb-2">Sample Type</th>
                  <th className="pb-2">Collection Date</th>
                  <th className="pb-2">Storage Location</th>
                  <th className="pb-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr
                    key={sample.id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-2 font-medium text-on-surface">
                      {sample.sample_type}
                    </td>
                    <td className="py-2 text-on-surface-variant">
                      {formatDate(sample.collection_date)}
                    </td>
                    <td className="py-2 text-secondary">
                      {sample.storage_location}
                    </td>
                    <td
                      className="py-2 text-on-surface-variant/80 italic max-w-xs truncate"
                      title={sample.notes}
                    >
                      {sample.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form
        onSubmit={handleLogSample}
        className="bg-surface-container p-6 rounded-lg border border-white/10 space-y-4"
      >
        <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">
          Log New Sample
        </h4>

        {error && (
          <div className="bg-error-container/20 border border-error text-error p-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Sample Type *
            </label>
            <input
              type="text"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              placeholder="e.g. Basalt Core, Water Column"
              className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Collection Date *
            </label>
            <input
              type="datetime-local"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Storage Location *
            </label>
            <input
              type="text"
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              placeholder="e.g. Cold Room A, Shelf 4"
              className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any additional observations..."
            className="w-full bg-[#05070A] border border-outline-variant text-on-surface rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-on-primary font-bold rounded hover:bg-primary-container text-sm transition-colors"
          >
            Log Sample
          </button>
        </div>
      </form>
    </div>
  );
}
