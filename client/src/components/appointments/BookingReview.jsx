import React from "react";

export default function BookingReview({
  selectedSlot,
  selectedDoctor,
  verificationResult,
  onConfirm,
  isBooking,
  reschedulingAppointment = null,
  onCancelReschedule = null,
}) {
  const formatSlotDisplay = (slotIso) => {
    if (!slotIso) return "None selected";
    const date = new Date(slotIso);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const baseFee = 150.0;
  const copay = verificationResult ? verificationResult.estimated_copay : null;
  const coverage = verificationResult ? baseFee - copay : null;

  return (
    <div class="bg-surface rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col h-full">
      <div class="border-b border-outline-variant pb-4 mb-6 flex justify-between items-center">
        <h3 class="font-h3 text-h3 text-on-background">
          {reschedulingAppointment ? "Reschedule Review" : "Booking Review"}
        </h3>
        {reschedulingAppointment && (
          <button
            onClick={onCancelReschedule}
            class="text-xs text-error hover:underline"
          >
            Cancel Rescheduling
          </button>
        )}
      </div>

      {/* Rescheduling Side-by-Side Comparison */}
      {reschedulingAppointment ? (
        <div class="space-y-4 mb-6">
          <div class="bg-gray-100 p-3 rounded-lg border border-outline-variant">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Current Slot
            </p>
            <p class="text-sm font-medium text-gray-700">
              {formatSlotDisplay(reschedulingAppointment.start_time)}
            </p>
          </div>
          <div class="flex justify-center">
            <span class="material-symbols-outlined text-primary rotate-90 lg:rotate-0">
              arrow_downward
            </span>
          </div>
          <div class="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <p class="text-xs font-bold text-primary uppercase tracking-wider mb-1">
              New Slot
            </p>
            <p class="text-sm font-bold text-primary">
              {selectedSlot
                ? formatSlotDisplay(selectedSlot.iso)
                : "Select a new slot from calendar"}
            </p>
          </div>
        </div>
      ) : (
        /* Selected Slot Summary */
        <div class="bg-surface-container-low p-4 rounded-lg border border-outline-variant flex items-start gap-4 mb-6">
          <div class="p-3 bg-primary/10 rounded-full text-primary">
            <span class="material-symbols-outlined" data-icon="schedule">
              schedule
            </span>
          </div>
          <div>
            <p class="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wide">
              Selected Slot
            </p>
            <p class="font-body-lg text-body-lg text-on-background font-medium">
              {selectedSlot
                ? formatSlotDisplay(selectedSlot.iso)
                : "No slot selected"}
            </p>
            <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">
              {selectedDoctor
                ? `with ${selectedDoctor.name} (${selectedDoctor.specialty})`
                : "Please select a doctor"}
            </p>
          </div>
        </div>
      )}

      {/* Verification Status Badge */}
      {verificationResult && (
        <div class="bg-[#DCFCE7] border border-[#bbf7d0] rounded-lg p-3 mb-6 flex items-start gap-3">
          <span
            class="material-symbols-outlined text-[#166534]"
            data-icon="check_circle"
          >
            check_circle
          </span>
          <p class="font-body-sm text-body-sm text-[#166534] mt-0.5">
            {verificationResult.message ||
              "Insurance Verified Successfully via Clearinghouse API"}
          </p>
        </div>
      )}

      {/* Cost Breakdown */}
      <div class="flex-1">
        <h4 class="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wide">
          Estimated Costs
        </h4>
        <div class="space-y-3 mb-6 border-b border-outline-variant pb-6">
          <div class="flex justify-between items-center font-body-sm text-body-sm text-on-surface">
            <span>Consultation Fee (Base)</span>
            <span>${baseFee.toFixed(2)}</span>
          </div>
          {coverage !== null && (
            <div class="flex justify-between items-center font-body-sm text-body-sm text-[#166534]">
              <span>Insurance Coverage</span>
              <span>-${coverage.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div class="flex justify-between items-end mb-6">
          <div>
            <span class="font-h2 text-h2 text-on-background font-bold">
              Estimated Co-Pay
            </span>
          </div>
          <div class="text-right">
            <span class="font-h1 text-h1 text-primary font-bold tracking-tight">
              {copay !== null
                ? `$${copay.toFixed(2)}`
                : "Co-pay estimate unavailable"}
            </span>
          </div>
        </div>
        <p class="font-label-sm text-label-sm text-on-surface-variant italic mb-8">
          *This is an estimate based on current benefits. Final patient
          responsibility may vary.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onConfirm}
        disabled={!selectedSlot || isBooking}
        class="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors shadow-md flex justify-center items-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="material-symbols-outlined" data-icon="check">
          check
        </span>
        {isBooking
          ? reschedulingAppointment
            ? "Rescheduling..."
            : "Booking..."
          : reschedulingAppointment
            ? "Confirm & Reschedule"
            : "Confirm & Book Appointment"}
      </button>
    </div>
  );
}
