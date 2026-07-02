import React from "react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";

export default function AlertConfirmationPage({
  decision,
  alert,
  onBackToDashboard,
}) {
  const isApproved = decision === "APPROVE";

  return (
    <div className="flex flex-col items-center justify-center py-12 max-w-md mx-auto w-full">
      <Card
        className="w-full text-center flex flex-col items-center p-8"
        glow={isApproved}
        alert={!isApproved}
      >
        <div
          className={`w-20 h-24 rounded-full flex items-center justify-center mb-6 ${isApproved ? "bg-secondary/20 border border-secondary" : "bg-[#EF4444]/20 border border-[#EF4444]"}`}
        >
          <span
            className={`material-symbols-outlined text-5xl ${isApproved ? "text-secondary" : "text-[#EF4444]"}`}
          >
            {isApproved ? "verified_user" : "gavel"}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-on-surface mb-2">
          {isApproved ? "Transaction Approved" : "Card Frozen & Blocked"}
        </h2>

        <p className="text-sm text-on-surface-variant mb-6">
          {isApproved
            ? `You have successfully approved the transaction of $${Number(alert?.amount).toFixed(2)} at ${alert?.merchant}.`
            : `The transaction of $${Number(alert?.amount).toFixed(2)} at ${alert?.merchant} has been blocked, and your card has been frozen to prevent further unauthorized activity.`}
        </p>

        <div className="w-full border-t border-[#334155] pt-6 mb-6 text-left flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Merchant:</span>
            <span className="text-on-surface font-medium">
              {alert?.merchant}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Amount:</span>
            <span className="text-on-surface font-medium">
              ${Number(alert?.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Status:</span>
            <span
              className={`font-bold ${isApproved ? "text-secondary" : "text-[#EF4444]"}`}
            >
              {isApproved ? "APPROVED" : "BLOCKED"}
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={onBackToDashboard}
          className="w-full"
        >
          Back to Dashboard
        </Button>
      </Card>
    </div>
  );
}
