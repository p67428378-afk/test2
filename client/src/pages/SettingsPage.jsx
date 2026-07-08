import React, { useState, useEffect } from "react";
import ToggleSwitch from "../components/common/ToggleSwitch";
import { getRoundupSettings, updateRoundupSettings } from "../services/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRoundupSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
        setError("Could not load round-up settings.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggle = async (newValue) => {
    try {
      setSaving(true);
      setSuccessMsg(null);
      const updated = await updateRoundupSettings(newValue);
      setSettings(updated);
      setSuccessMsg(
        newValue
          ? "Automatic Round-Up Investing enabled!"
          : "Automatic Round-Up Investing disabled.",
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 px-margin-desktop pb-margin-desktop w-full max-w-3xl mx-auto">
        <p className="text-on-surface-variant">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-margin-desktop pb-margin-desktop w-full max-w-3xl mx-auto flex flex-col gap-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Settings
        </h1>
        <p className="text-on-surface-variant text-sm">
          Manage your micro-investing preferences and linked accounts.
        </p>
      </div>

      {error && (
        <div className="bg-error-container/20 border border-error/30 rounded-lg p-4 text-error">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-primary-container/10 border border-primary/20 rounded-lg p-4 text-primary">
          {successMsg}
        </div>
      )}

      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex flex-col gap-6">
        <h2 className="font-headline-md text-headline-md text-on-surface text-lg border-b border-outline-variant/50 pb-3">
          Round-Up Investing
        </h2>

        <ToggleSwitch
          enabled={settings?.is_roundup_enabled || false}
          onChange={handleToggle}
          label="Enable Automatic Round-Up Investing"
        />

        <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/50 space-y-2">
          <h3 className="font-label-md text-label-md text-on-surface font-semibold">
            Linked Debit Card
          </h3>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Account Name</span>
            <span className="font-semibold text-on-surface">
              Primary Debit Card
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant">Status</span>
            <span className="text-primary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{" "}
              Connected
            </span>
          </div>
        </div>

        <div className="text-xs text-on-surface-variant space-y-1">
          <p>
            * Round-ups are calculated to the nearest dollar on all debit card
            purchases.
          </p>
          <p>
            * Exact dollar purchases (e.g., $5.00) result in $0.00 round-up and
            are skipped.
          </p>
          <p>
            * Voided or returned transactions are automatically excluded from
            daily aggregation.
          </p>
        </div>
      </div>
    </div>
  );
}
