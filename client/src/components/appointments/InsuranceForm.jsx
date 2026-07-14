import React, { useState } from "react";

export default function InsuranceForm({
  onVerify,
  isVerifying,
  verificationResult,
  error,
}) {
  const [provider, setProvider] = useState("Blue Cross Blue Shield");
  const [policyId, setPolicyId] = useState("BCBS-987654321-X");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!provider || !policyId) return;
    onVerify(provider, policyId);
  };

  return (
    <div class="bg-surface border border-outline-variant rounded-lg p-5">
      <h4 class="font-label-md text-label-md text-on-background font-bold mb-4 flex items-center gap-2">
        <span
          class="material-symbols-outlined text-on-surface-variant text-[18px]"
          data-icon="verified_user"
        >
          verified_user
        </span>
        Insurance Pre-Verification
      </h4>
      <form onSubmit={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              Insurance Provider
            </label>
            <div class="relative">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                class="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 pr-8 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="Blue Cross Blue Shield">
                  Blue Cross Blue Shield
                </option>
                <option value="Aetna">Aetna</option>
                <option value="Cigna">Cigna</option>
                <option value="UnitedHealthcare">UnitedHealthcare</option>
                <option value="Kaiser Permanente">Kaiser Permanente</option>
              </select>
              <span
                class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none"
                data-icon="keyboard_arrow_down"
              >
                keyboard_arrow_down
              </span>
            </div>
          </div>
          <div>
            <label class="block font-label-sm text-label-sm text-on-surface-variant mb-1">
              Policy ID
            </label>
            <input
              type="text"
              value={policyId}
              onChange={(e) => setPolicyId(e.target.value)}
              placeholder="Enter Policy ID"
              class="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-3 py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isVerifying}
          class="bg-primary text-on-primary px-4 py-2 rounded-md font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined text-[18px]" data-icon="sync">
            sync
          </span>
          {isVerifying ? "Verifying..." : "Verify Insurance"}
        </button>
      </form>

      {error && (
        <div class="mt-3 text-sm text-error flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
