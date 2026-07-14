import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "../../services/api";

export default function UpsellBanner({ onConvertSuccess }) {
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function checkEligibility() {
      try {
        const data = await subscriptionService.getUpsellEligibility();
        setEligibility(data);
      } catch (err) {
        console.error("Failed to fetch upsell eligibility", err);
      } finally {
        setLoading(false);
      }
    }
    checkEligibility();
  }, []);

  const handleDismiss = async () => {
    setActionLoading(true);
    try {
      await subscriptionService.dismissUpsellBanner();
      setEligibility((prev) => ({ ...prev, is_eligible: false }));
    } catch (err) {
      console.error("Failed to dismiss upsell banner", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvert = async () => {
    setActionLoading(true);
    try {
      // Convert the last order's box size into a subscription with default 4 weeks frequency
      const boxSize = eligibility?.last_order?.box_size || "Medium";
      await subscriptionService.createSubscription(boxSize, 4, "tok_visa");
      if (onConvertSuccess) {
        onConvertSuccess();
      }
      setEligibility((prev) => ({ ...prev, is_eligible: false }));
      navigate("/profile");
    } catch (err) {
      console.error("Failed to convert to subscription", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !eligibility || !eligibility.is_eligible) {
    return null;
  }

  const boxSize = eligibility.last_order?.box_size || "Large";

  return (
    <section className="bg-surface-bright rounded-xl border border-yellow-600/30 shadow-sm overflow-hidden flex flex-col md:flex-row relative">
      <div className="p-8 md:w-2/3 flex flex-col justify-center z-10">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">
          Love our chocolates? <span className="text-2xl">🍫</span>
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-lg">
          Turn your recent order of a {boxSize} Chocolate Box into a monthly
          subscription and save 10% on every delivery!
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleConvert}
            disabled={actionLoading}
            className="bg-primary-container text-secondary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary transition-colors flex items-center shadow-sm disabled:opacity-50"
          >
            Convert to Subscription & Save 10%
          </button>
          <button
            onClick={handleDismiss}
            disabled={actionLoading}
            className="text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors underline-offset-4 hover:underline disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      </div>
      <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-bright to-transparent z-10 md:w-24"></div>
        <img
          className="w-full h-full object-cover object-center absolute inset-0"
          alt="Decadent chocolates"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuACdcdR9k2H5-fcGmDdfnnu4ErHx4xZooxwahDOueGEA5XlfMXM3KYMfbhnH3mf9_hgVBJT1klDZbUTb1MNJ3aRIN_nsCF1QBPRMPNQDFY1qPu52k-ocbxsOM-9amPysEzF_TqrrWg55q3M7knwvufT-SFhddLiNKtjhJ72lUZi7lXZoKfRXvAKnSpdQ9rc58w0phv_0UOfxeyso5TdHO6QfoKiQFZTw1StApwmk3bil3gf6ikoKHNvp7r4Lj4nWbq3UmslP7LDt6c"
        />
      </div>
    </section>
  );
}
