import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../services/api.js";
import FXRateLockPanel from "../components/FXRateLockPanel.jsx";
import CompliancePreFlight from "../components/CompliancePreFlight.jsx";
import Button from "../components/Button.jsx";
import { Send, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function InitiatePaymentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source_account_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Default mock account
    source_currency: "USD",
    target_currency: "EUR",
    amount: "",
    beneficiary_name: "",
    beneficiary_account_number: "",
    beneficiary_routing_number: "",
    destination_country: "DE",
    settlement_network: "SWIFT",
  });

  const [rateLockId, setRateLockId] = useState(null);
  const [lockedRate, setLockedRate] = useState(null);
  const [lockedFee, setLockedFee] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const [submitting, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
    // Reset rate lock if currency or amount changes
    if (
      name === "source_currency" ||
      name === "target_currency" ||
      name === "amount"
    ) {
      setRateLockId(null);
      setLockedRate(null);
      setLockedFee(null);
      setConvertedAmount(null);
    }
  };

  const handleRateLocked = (lockId, rate, fee, convAmount) => {
    setRateLockId(lockId);
    setLockedRate(rate);
    setLockedFee(fee);
    setConvertedAmount(convAmount);
  };

  const handleRateReset = () => {
    setRateLockId(null);
    setLockedRate(null);
    setLockedFee(null);
    setConvertedAmount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rateLockId) {
      setError("Please lock an FX rate before submitting the payment.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        rate_lock_id: rateLockId,
      };
      const result = await createPayment(payload);
      setSuccessData(result);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Payment initiation failed. Please check risk limits or compliance.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-12">
        <div className="glass-panel rounded-xl p-8 text-center space-y-6 border border-emerald-500/20 bg-emerald-500/5">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-on-surface">
              Payment Initiated Successfully
            </h2>
            <p className="text-sm text-on-surface-variant">
              Your cross-border payment has been processed compliantly and
              securely.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10 text-left space-y-3 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Payment ID:</span>
              <span className="text-primary font-bold">
                {successData.payment_id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Status:</span>
              <span className="text-emerald-400 font-bold">
                {successData.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Compliance:</span>
              <span className="text-emerald-400">
                {successData.compliance_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Fraud Check:</span>
              <span className="text-emerald-400">
                {successData.fraud_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Settlement:</span>
              <span className="text-emerald-400">
                {successData.settlement_status}
              </span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Go to Dashboard
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/payments/${successData.payment_id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const showFXPanel =
    formData.source_currency && formData.target_currency && formData.amount > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-1 text-indigo-glow">
          Initiate Cross-Border Payment
        </h2>
        <p className="text-sm text-on-surface-variant">
          Secure, compliant foreign currency settlement with real-time FX rate
          locking.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Payment Details */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-on-surface border-b border-outline-variant/10 pb-2">
              Payment Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                  Source Currency
                </label>
                <select
                  name="source_currency"
                  value={formData.source_currency}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                  Target Currency
                </label>
                <select
                  name="target_currency"
                  value={formData.target_currency}
                  onChange={handleChange}
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
                >
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount to convert"
                required
                min="0.01"
                step="any"
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Settlement Network
              </label>
              <select
                name="settlement_network"
                value={formData.settlement_network}
                onChange={handleChange}
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
              >
                <option value="SWIFT">SWIFT</option>
                <option value="SEPA">SEPA</option>
                <option value="FedNow">FedNow</option>
                <option value="RTP">RTP</option>
              </select>
            </div>
          </div>

          {/* Right Column: Beneficiary Details */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-on-surface border-b border-outline-variant/10 pb-2">
              Beneficiary Details
            </h3>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Beneficiary Name
              </label>
              <input
                type="text"
                name="beneficiary_name"
                value={formData.beneficiary_name}
                onChange={handleChange}
                placeholder="e.g. Siemens AG"
                required
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Account Number / IBAN
              </label>
              <input
                type="text"
                name="beneficiary_account_number"
                value={formData.beneficiary_account_number}
                onChange={handleChange}
                placeholder="Enter account number"
                required
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Routing Number / BIC / SWIFT Code
              </label>
              <input
                type="text"
                name="beneficiary_routing_number"
                value={formData.beneficiary_routing_number}
                onChange={handleChange}
                placeholder="Enter routing number"
                required
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Destination Country (ISO 2-Letter)
              </label>
              <input
                type="text"
                name="destination_country"
                value={formData.destination_country}
                onChange={handleChange}
                placeholder="e.g. DE"
                required
                maxLength="2"
                className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg py-2 px-3 text-sm text-on-surface focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* FX Rate Lock Panel */}
        {showFXPanel && (
          <FXRateLockPanel
            sourceCurrency={formData.source_currency}
            targetCurrency={formData.target_currency}
            amount={formData.amount}
            onRateLocked={handleRateLocked}
            onReset={handleRateReset}
          />
        )}

        {/* Compliance Pre-Flight */}
        {showFXPanel && (
          <CompliancePreFlight
            complianceData={{ risk_score: 15, status: "Passed" }}
            fraudData={{ score: 8 }}
            riskData={{ valid: true }}
          />
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || !rateLockId}
            className="w-48"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Confirm & Settle
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
