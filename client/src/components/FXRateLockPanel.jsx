import React, { useState, useEffect, useRef } from "react";
import { getFXRates } from "../services/api.js";
import { RefreshCw, ShieldCheck, AlertTriangle } from "lucide-react";

export default function FXRateLockPanel({
  sourceCurrency,
  targetCurrency,
  amount,
  onRateLocked,
  onReset,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateData, setRateData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  const fetchRates = async () => {
    if (!sourceCurrency || !targetCurrency || !amount || amount <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFXRates(sourceCurrency, targetCurrency, amount);
      setRateData(data);
      onRateLocked(
        data.rate_lock_id,
        data.rate,
        data.fee,
        data.converted_amount,
      );

      // Start 30 seconds countdown
      const expiresAt = new Date(data.expires_at).getTime();
      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = Math.max(0, Math.round((expiresAt - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          clearInterval(timerRef.current);
          setError("Rate lock expired. Please refresh to get a new rate.");
          onReset();
        }
      };
      clearInterval(timerRef.current);
      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to fetch FX rates. Please try again.",
      );
      onReset();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    return () => clearInterval(timerRef.current);
  }, [sourceCurrency, targetCurrency, amount]);

  if (loading) {
    return (
      <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center h-48">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
        <p className="text-sm text-on-surface-variant">
          Fetching real-time FX rates from liquidity providers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center h-48">
        <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-sm text-red-400 text-center mb-4">{error}</p>
        <button
          onClick={fetchRates}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Get New Rate
        </button>
      </div>
    );
  }

  if (!rateData) return null;

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          FX Rate Lock Details
        </span>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-indigo-400">
            Rate Locked: {timeLeft}s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-xs text-on-surface-variant block">
            Base Rate
          </span>
          <span className="font-mono text-lg font-bold text-on-surface">
            {rateData.base_rate.toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-xs text-on-surface-variant block">
            Bid / Ask
          </span>
          <span className="font-mono text-lg font-bold text-on-surface">
            {rateData.bid_rate.toFixed(4)} / {rateData.ask_rate.toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-xs text-on-surface-variant block">Spread</span>
          <span className="font-mono text-lg font-bold text-on-surface">
            {(rateData.spread * 100).toFixed(3)}%
          </span>
        </div>
        <div>
          <span className="text-xs text-on-surface-variant block">
            Transaction Fee
          </span>
          <span className="font-mono text-lg font-bold text-on-surface">
            {rateData.fee.toFixed(2)} {rateData.source_currency}
          </span>
        </div>
      </div>

      <div className="border-t border-outline-variant/10 pt-4 flex justify-between items-center">
        <div>
          <span className="text-xs text-on-surface-variant block">
            Converted Amount
          </span>
          <span className="font-mono text-2xl font-bold text-primary">
            {rateData.converted_amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {rateData.target_currency}
          </span>
        </div>
        <button
          onClick={fetchRates}
          className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-variant/30 rounded-full"
          title="Refresh Rate"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <div className="text-[11px] text-on-surface-variant/70 flex items-center gap-1">
        <span>Liquidity Provider:</span>
        <span className="font-semibold text-on-surface-variant">
          {rateData.provider}
        </span>
      </div>
    </div>
  );
}
