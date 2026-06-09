import React, { useEffect, useState } from 'react';
import { getConfig, updateConfig } from '../services/api';

export default function ConfigurationPage() {
  const [config, setConfig] = useState({
    pep8_enabled: true,
    max_line_length: 79,
    owasp_top_10: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getConfig();
        setConfig(data);
      } catch (err) {
        console.error("Error fetching configuration", err);
        setError("Failed to load configuration. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateConfig(config);
      setConfig(updated);
      setSuccessMessage("Configuration updated successfully!");
    } catch (err) {
      console.error("Error updating configuration", err);
      setError("Failed to update configuration. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Loading configuration...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="font-sans text-xl font-bold text-on-surface">
          Code Review Configuration
        </h2>
        <p className="font-sans text-xs text-on-surface-variant">
          Configure the rules and compliance checks for automated code reviews.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          <span className="text-xs font-medium">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-xs font-medium">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card rounded-xl p-6 space-y-6">
        {/* PEP8 Check */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <label className="font-sans font-semibold text-sm text-on-surface block">
              PEP 8 Compliance
            </label>
            <span className="font-sans text-xs text-on-surface-variant block">
              Enforce Python PEP 8 style guide rules during code analysis.
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.pep8_enabled}
            onChange={(e) => setConfig({ ...config, pep8_enabled: e.target.checked })}
            className="w-5 h-5 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/30"
          />
        </div>

        {/* Max Line Length */}
        <div className="space-y-2">
          <label className="font-sans font-semibold text-sm text-on-surface block">
            Maximum Line Length
          </label>
          <span className="font-sans text-xs text-on-surface-variant block">
            Specify the maximum allowed line length for code files.
          </span>
          <input
            type="number"
            value={config.max_line_length}
            onChange={(e) => setConfig({ ...config, max_line_length: parseInt(e.target.value) || 79 })}
            className="w-full max-w-xs bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* OWASP Top 10 */}
        <div className="flex items-start justify-between gap-4 border-t border-outline-variant/30 pt-6">
          <div className="space-y-1">
            <label className="font-sans font-semibold text-sm text-on-surface block">
              OWASP Top 10 Security Scan
            </label>
            <span className="font-sans text-xs text-on-surface-variant block">
              Scan for common security vulnerabilities listed in the OWASP Top 10.
            </span>
          </div>
          <input
            type="checkbox"
            checked={config.owasp_top_10}
            onChange={(e) => setConfig({ ...config, owasp_top_10: e.target.checked })}
            className="w-5 h-5 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/30"
          />
        </div>

        {/* Submit Button */}
        <div className="border-t border-outline-variant/30 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-surface font-semibold text-sm rounded-lg hover:bg-primary-container transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
