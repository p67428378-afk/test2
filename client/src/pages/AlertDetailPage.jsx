import React from "react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import Badge from "../components/common/Badge.jsx";
import CircularCountdownTimer from "../components/alerts/CircularCountdownTimer.jsx";
import ProximityMap from "../components/alerts/ProximityMap.jsx";

export default function AlertDetailPage({
  alert,
  onBack,
  onApprove,
  onBlock,
  isProcessing,
}) {
  if (!alert) return null;

  const isPending = alert.status === "PENDING";
  const isBlocked = alert.decision === "BLOCK" || alert.status === "BLOCKED";
  const isApproved =
    alert.decision === "APPROVE" || alert.status === "APPROVED";

  let badgeVariant = "info";
  let statusText = "Pending";
  if (isApproved) {
    badgeVariant = "success";
    statusText = "Approved";
  } else if (isBlocked) {
    badgeVariant = "danger";
    statusText = "Blocked";
  }

  const formattedDate = new Date(alert.created_at).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-surface-container-highest border border-outline-variant text-on-surface hover:bg-surface-bright transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Alert Details</h2>
          <p className="text-sm text-on-surface-variant">
            ID: #{alert.id.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider">
                  Merchant
                </span>
                <h3 className="text-2xl font-bold text-on-surface mt-1">
                  {alert.merchant}
                </h3>
              </div>
              <Badge variant={badgeVariant}>{statusText}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider">
                  Amount
                </span>
                <p className="text-3xl font-bold text-on-surface mt-1">
                  ${Number(alert.amount).toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-xs text-on-surface-variant uppercase tracking-wider">
                  Date &amp; Time
                </span>
                <p className="text-sm text-on-surface mt-1">{formattedDate}</p>
              </div>
            </div>

            <div className="border-t border-[#334155] pt-6">
              <h4 className="text-sm font-semibold text-on-surface mb-2">
                Security Context
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                This transaction exceeded your configured threshold of{" "}
                <strong>$2,000.00</strong>. An instant SMS and Push notification
                were dispatched to your registered devices.
              </p>
            </div>

            {isPending && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8 border-t border-[#334155] pt-6">
                <Button
                  variant="primary"
                  onClick={() => onApprove(alert)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  {isProcessing ? "Processing..." : "Approve Transaction"}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onBlock(alert)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    block
                  </span>
                  {isProcessing ? "Processing..." : "Block & Freeze Card"}
                </Button>
              </div>
            )}
          </Card>

          {/* Proximity Map */}
          <ProximityMap merchant={alert.merchant} />
        </div>

        {/* Right Column: Countdown & Actions */}
        <div className="flex flex-col gap-6">
          {isPending ? (
            <Card
              alert
              className="flex flex-col items-center justify-center py-10"
            >
              <CircularCountdownTimer
                initialSeconds={252}
                onTimeUp={() => onBlock(alert)}
              />
              <p className="text-xs text-on-surface-variant text-center mt-4 max-w-[200px]">
                If no action is taken before the timer expires, the transaction
                will be automatically blocked for your security.
              </p>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApproved ? "bg-secondary/20 border border-secondary" : "bg-[#EF4444]/20 border border-[#EF4444]"}`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${isApproved ? "text-secondary" : "text-[#EF4444]"}`}
                >
                  {isApproved ? "check_circle" : "block"}
                </span>
              </div>
              <h4 className="text-lg font-bold text-on-surface">
                Action Completed
              </h4>
              <p className="text-sm text-on-surface-variant mt-2 max-w-[200px]">
                This alert has been resolved. The transaction was{" "}
                <strong>{statusText.toLowerCase()}</strong>.
              </p>
            </Card>
          )}

          <Card>
            <h4 className="text-sm font-semibold text-on-surface mb-4">
              Notification Channels
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">sms</span>{" "}
                  SMS Alert
                </span>
                <span className="text-secondary font-medium">Delivered</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">
                    phone_iphone
                  </span>{" "}
                  Push Notification
                </span>
                <span className="text-secondary font-medium">Delivered</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">
                    mail
                  </span>{" "}
                  Email Receipt
                </span>
                <span className="text-secondary font-medium">Delivered</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
