import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPaymentDetail, retryPayment } from "../services/api.js";
import Badge from "../components/Badge.jsx";
import Button from "../components/Button.jsx";
import AuditLogTable from "../components/AuditLogTable.jsx";
import {
  ArrowLeft,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function PaymentDetailPage() {
  const { payment_id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const fetchPaymentDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentDetail(payment_id);
      setPayment(data);
    } catch (err) {
      setError("Failed to load payment details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetail();
  }, [payment_id]);

  const handleRetry = async () => {
    setRetrying(true);
    setError(null);
    try {
      const result = await retryPayment(payment_id);
      // Refresh details
      await fetchPaymentDetail();
    } catch (err) {
      setError(err.response?.data?.detail || "Retry failed. Please try again.");
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        Loading payment details...
      </div>
    );
  }

  if (error && !payment) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-red-400">{error}</div>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        {payment.status === "Failed" && (
          <Button variant="primary" onClick={handleRetry} disabled={retrying}>
            {retrying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Retry Settlement
              </>
            )}
          </Button>
        )}
      </div>

      {/* Title & Status */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Transaction Details
          </span>
          <h2 className="text-3xl font-bold text-on-surface font-mono mt-1">
            {payment.payment_id.toUpperCase()}
          </h2>
        </div>
        <Badge status={payment.status} />
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payment Info */}
        <div className="glass-panel rounded-xl p-6 space-y-4 md:col-span-2">
          <h3 className="font-bold text-on-surface border-b border-outline-variant/10 pb-2">
            Payment Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs text-on-surface-variant block">
                Amount
              </span>
              <span className="font-mono text-xl font-bold text-on-surface">
                {payment.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {payment.source_currency}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Converted Amount
              </span>
              <span className="font-mono text-xl font-bold text-primary">
                {(payment.amount * payment.rate).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {payment.target_currency}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Locked FX Rate
              </span>
              <span className="font-mono text-sm text-on-surface">
                {payment.rate.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Transaction Fee
              </span>
              <span className="font-mono text-sm text-on-surface">
                {payment.fee.toFixed(2)} {payment.source_currency}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Settlement Network
              </span>
              <span className="text-sm text-on-surface font-semibold">
                {payment.settlement_network}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Source Account
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                {payment.source_account_id}
              </span>
            </div>
          </div>
        </div>

        {/* Beneficiary Info */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-on-surface border-b border-outline-variant/10 pb-2">
            Beneficiary Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-on-surface-variant block">
                Name
              </span>
              <span className="text-sm text-on-surface font-semibold">
                {payment.beneficiary_name}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Account Number / IBAN
              </span>
              <span className="font-mono text-sm text-on-surface">
                {payment.beneficiary_account_number}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Routing Number / BIC
              </span>
              <span className="font-mono text-sm text-on-surface">
                {payment.beneficiary_routing_number}
              </span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">
                Destination Country
              </span>
              <span className="text-sm text-on-surface font-semibold">
                {payment.destination_country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Fraud Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compliance Check */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-on-surface">
              KYC/AML Compliance Check
            </h3>
          </div>
          {payment.compliance_check ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">
                  Sanction Screening:
                </span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />{" "}
                  {payment.compliance_check.sanction_screen_status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">
                  Risk Score:
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {payment.compliance_check.risk_score}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Status:</span>
                <Badge status={payment.compliance_check.status} />
              </div>
              <p className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                {payment.compliance_check.details}
              </p>
            </div>
          ) : (
            <div className="text-sm text-on-surface-variant">
              No compliance check data available.
            </div>
          )}
        </div>

        {/* Fraud Score */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-2">
            <AlertTriangle className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-on-surface">
              Real-Time Fraud Detection
            </h3>
          </div>
          {payment.fraud_score ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">
                  Anomaly Score:
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {payment.fraud_score.score}/100
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Status:</span>
                <Badge status={payment.fraud_score.status} />
              </div>
              <p className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant/10">
                {payment.fraud_score.details}
              </p>
            </div>
          ) : (
            <div className="text-sm text-on-surface-variant">
              No fraud score data available.
            </div>
          )}
        </div>
      </div>

      {/* Audit Logs */}
      <AuditLogTable logs={payment.audit_logs} />
    </div>
  );
}
