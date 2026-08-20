import React, { useState } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { claimService } from "../../services/api";
import Button from "../common/Button";

export default function ClaimForm({ product, onClaimSubmitted }) {
  const [claimDate, setClaimDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [issueDescription, setIssueDescription] = useState("");
  const [serviceCost, setServiceCost] = useState("0.00");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  const isExpired = product.warranty?.status === "Expired";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!claimDate || !issueDescription) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const newClaim = await claimService.create({
        product_id: product.id,
        claim_date: claimDate,
        issue_description: issueDescription,
        service_cost: parseFloat(serviceCost) || 0.0,
      });
      setSuccess("Warranty claim submitted successfully!");
      setIssueDescription("");
      setServiceCost("0.00");
      if (onClaimSubmitted) {
        onClaimSubmitted(newClaim);
      }
    } catch (err) {
      setError("Failed to submit warranty claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-col gap-3 items-start p-6 rounded-2xl shadow-sm w-full shrink-0">
      <p className="font-bold text-[#171c29] text-lg whitespace-nowrap">
        Submit Warranty Claim
      </p>

      {isExpired && (
        <div className="bg-yellow-50 border border-[#eb9917] flex gap-3 items-center p-3 rounded-xl w-full shrink-0">
          <AlertTriangle className="w-5 h-5 text-[#eb9917] shrink-0" />
          <p className="text-xs text-[#eb9917] font-medium">
            Warning: This product's standard warranty expired on{" "}
            {product.warranty?.expiry_date || "N/A"}. Claims submitted now may
            incur service costs.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm w-full">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm w-full">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1 items-start w-full shrink-0">
          <label
            htmlFor="claim-date"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Claim Date *
          </label>
          <input
            id="claim-date"
            type="date"
            value={claimDate}
            onChange={(e) => setClaimDate(e.target.value)}
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
            required
          />
        </div>

        <div className="flex flex-col gap-1 items-start w-full shrink-0">
          <label
            htmlFor="issue-description"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Issue Description *
          </label>
          <textarea
            id="issue-description"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            placeholder="e.g., Charging port loose / battery health degraded"
            rows={3}
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb] resize-none"
            required
          />
        </div>

        <div className="flex flex-col gap-1 items-start w-full shrink-0">
          <label
            htmlFor="service-cost"
            className="font-medium text-[#707a8c] text-xs whitespace-nowrap"
          >
            Estimated Service Cost ($)
          </label>
          <input
            id="service-cost"
            type="number"
            step="0.01"
            min="0"
            value={serviceCost}
            onChange={(e) => setServiceCost(e.target.value)}
            placeholder="0.00"
            className="bg-[#f2f5fa] border border-[#e3e8f0] p-3 rounded-lg w-full text-sm text-[#171c29] focus:outline-none focus:border-[#2663eb]"
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full">
          Submit Claim
        </Button>
      </form>
    </div>
  );
}
