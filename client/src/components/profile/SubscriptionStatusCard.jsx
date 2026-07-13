import React from "react";

export default function SubscriptionStatusCard({
  subscription,
  onUpdate,
  loading,
}) {
  if (!subscription) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/20 text-center">
        <span className="material-symbols-outlined text-5xl text-outline mb-4">
          sentiment_dissatisfied
        </span>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
          No Active Subscription
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          You don't have an active chocolate subscription yet.
        </p>
        <a
          href="/subscribe"
          className="inline-flex items-center gap-2 bg-primary-container text-secondary-fixed-dim hover:bg-primary py-3 px-6 rounded-full font-label-md text-label-md transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          Subscribe Now
        </a>
      </div>
    );
  }

  const sizeNames = {
    Small: "The Taster (12 Chocolates)",
    Medium: "The Connoisseur (24 Chocolates)",
    Large: "The Chocolatier (48 Chocolates)",
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const formattedDate = new Date(
    subscription.next_payment_date,
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/20 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-outline-variant/10">
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1">
            Current Plan
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {sizeNames[subscription.box_size] || subscription.box_size}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full font-label-sm text-label-sm border ${statusColors[subscription.status] || "bg-gray-100 text-gray-800"}`}
          >
            {subscription.status.toUpperCase()}
          </span>
          {subscription.skip_next && (
            <span className="px-3 py-1 rounded-full font-label-sm text-label-sm bg-blue-100 text-blue-800 border border-blue-200">
              SKIPPING NEXT
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-surface-tint">
              event_repeat
            </span>
            <strong>Frequency:</strong> Every {subscription.frequency_weeks}{" "}
            weeks
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-surface-tint">
              calendar_today
            </span>
            <strong>Next Payday:</strong> {formattedDate}
          </p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/10">
          <h4 className="font-label-md text-label-md text-on-surface mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            The 48-Hour Rule
          </h4>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
            Cancellations, pauses, or skips requested less than 48 hours before
            payday will apply to the following cycle. The upcoming box will
            still be charged and shipped.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {subscription.status === "active" && (
          <>
            <button
              onClick={() => onUpdate("paused")}
              disabled={loading}
              className="flex-1 min-w-[140px] bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">pause_circle</span>
              Pause Subscription
            </button>
            <button
              onClick={() => onUpdate(undefined, !subscription.skip_next)}
              disabled={loading}
              className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">skip_next</span>
              {subscription.skip_next ? "Unskip Next Box" : "Skip Next Box"}
            </button>
            <button
              onClick={() => onUpdate("cancelled")}
              disabled={loading}
              className="flex-1 min-w-[140px] bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">cancel</span>
              Cancel Subscription
            </button>
          </>
        )}

        {subscription.status === "paused" && (
          <button
            onClick={() => onUpdate("active")}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">play_circle</span>
            Resume Subscription
          </button>
        )}
      </div>
    </div>
  );
}
