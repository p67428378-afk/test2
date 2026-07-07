import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { ShieldAlert, CheckCircle, Ban, Loader2, Wallet } from "lucide-react";
import {
  getTransactionDetails,
  submitTransactionAction,
} from "../services/api";
import VerificationCard from "../components/transaction/VerificationCard";
import TransactionDetails from "../components/transaction/TransactionDetails";

export default function TransactionApprovalPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // State for instant digital card provisioning flow
  const [isBlocked, setIsBlocked] = useState(false);
  const [walletToken, setWalletToken] = useState(null);
  const [provisioningWallet, setProvisioningWallet] = useState(null); // 'apple' or 'google'
  const [provisionedSuccess, setProvisionedSuccess] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setError("Missing transaction ID or secure verification token.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await getTransactionDetails(id, token);
        setTransaction(data);

        // If transaction is already processed, redirect or show status
        if (data.status === "approved") {
          navigate(`/success?id=${id}&status=${data.status}`);
        } else if (data.status === "blocked") {
          setIsBlocked(true);
        }
      } catch (err) {
        console.error(err);
        const msg =
          err.response?.data?.detail ||
          "Failed to load transaction details. The link may be invalid or expired.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token, navigate]);

  // Countdown timer logic
  useEffect(() => {
    if (!transaction || !transaction.expires_at || isBlocked) return;

    const updateTimer = () => {
      const expiry = new Date(transaction.expires_at).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        setError("This verification link has expired.");
        return;
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const minStr = minutes < 10 ? `0${minutes}` : minutes;
      const secStr = seconds < 10 ? `0${seconds}` : seconds;

      setTimeLeft(`${minStr}:${secStr}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [transaction, isBlocked]);

  const handleAction = async (action) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await submitTransactionAction(id, action, token);
      if (action === "block") {
        setIsBlocked(true);
        if (result.wallet_token) {
          setWalletToken(result.wallet_token);
        }
        // Update local transaction status
        setTransaction((prev) => ({ ...prev, status: "BLOCKED" }));
      } else {
        navigate(`/success?id=${id}&status=${result.status}`);
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.detail ||
        "Failed to submit action. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToWallet = (walletType) => {
    setProvisioningWallet(walletType);
    // Simulate instant digital card token provisioning
    setTimeout(() => {
      setProvisioningWallet(null);
      setProvisionedSuccess(true);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-margin-desktop bg-[#0b1326]">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-on-surface-variant text-body-lg">
          Verifying secure connection...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center p-margin-desktop bg-[#0b1326]">
        <div className="w-full max-w-md bg-[#1E293B] border border-red-500/30 rounded-xl p-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-headline-md font-headline-md text-on-surface mb-2">
            Verification Failed
          </h2>
          <p className="text-on-surface-variant text-body-md mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-container hover:bg-[#059669] text-[#002113] font-label-md text-label-md rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow flex items-center justify-center p-margin-desktop bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high/40 via-background to-background">
      <VerificationCard timeLeft={isBlocked ? null : timeLeft}>
        <TransactionDetails transaction={transaction} />

        {isBlocked ? (
          <div className="p-md border-t border-[#334155] bg-[#1E293B] flex flex-col items-center text-center space-y-sm">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 mb-2">
              <Ban className="w-8 h-8" />
            </div>
            <h2 className="text-headline-md font-headline-md text-on-surface">
              Physical Card Plastic Killed
            </h2>
            <p className="text-on-surface-variant text-body-md max-w-lg">
              Your physical card ending in *4321 has been permanently
              deactivated to prevent fraud. However, we have instantly
              provisioned a new digital debit card token for you.
            </p>

            {provisionedSuccess ? (
              <div className="w-full max-w-md p-sm bg-primary-container/10 border border-primary-container/20 rounded-lg text-primary flex items-center justify-center gap-xs mt-md">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Successfully added to your Wallet! Ready for instant use.
                </span>
              </div>
            ) : (
              <div className="w-full max-w-md space-y-sm pt-md">
                <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
                  Add New Digital Card to Wallet
                </p>
                <div className="flex flex-col sm:flex-row gap-sm justify-center">
                  <button
                    disabled={provisioningWallet !== null}
                    onClick={() => handleAddToWallet("apple")}
                    className="flex items-center justify-center gap-xs px-6 py-3 bg-black hover:bg-neutral-900 text-white font-label-md text-label-md rounded-lg transition-colors border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E293B] focus:ring-white disabled:opacity-50"
                  >
                    {provisioningWallet === "apple" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                    <span>Add to Apple Wallet</span>
                  </button>
                  <button
                    disabled={provisioningWallet !== null}
                    onClick={() => handleAddToWallet("google")}
                    className="flex items-center justify-center gap-xs px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-label-md text-label-md rounded-lg transition-colors border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E293B] focus:ring-white disabled:opacity-50"
                  >
                    {provisioningWallet === "google" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wallet className="w-5 h-5" />
                    )}
                    <span>Add to Google Wallet</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Action Buttons */
          <div className="p-md border-t border-[#334155] bg-[#1E293B] flex flex-col sm:flex-row justify-end gap-sm">
            <button
              disabled={submitting}
              onClick={() => handleAction("block")}
              className="flex items-center justify-center gap-xs px-8 py-4 bg-[#F43F5E] hover:bg-[#E11D48] text-white font-label-md text-label-md rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#F43F5E] focus:ring-offset-2 focus:ring-offset-[#1E293B] disabled:opacity-50"
            >
              <Ban className="w-5 h-5" />
              <span>Block & Report Fraud</span>
            </button>
            <button
              disabled={submitting}
              onClick={() => handleAction("approve")}
              className="flex items-center justify-center gap-xs px-8 py-4 bg-primary-container hover:bg-[#059669] text-[#002113] font-label-md text-label-md rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 focus:ring-offset-[#1E293B] shadow-[0_4px_14px_rgba(16,185,129,0.4)] disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Approve Transaction</span>
            </button>
          </div>
        )}
      </VerificationCard>
    </main>
  );
}
