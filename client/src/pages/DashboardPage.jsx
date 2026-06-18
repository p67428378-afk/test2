import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPayments } from "../services/api.js";
import Badge from "../components/Badge.jsx";
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  Wallet,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await getPayments({ limit: 50 });
        setPayments(data);
      } catch (err) {
        setError("Failed to load recent payments.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Calculate KPIs
  const settledPayments = payments.filter((p) => p.status === "Settled");
  const totalSettledVolume = settledPayments.reduce(
    (sum, p) => sum + p.amount,
    0,
  );
  const activeLocksCount = 3; // Mock active locks count
  const dailyLimitUtilization = 64; // Mock daily limit utilization %
  const complianceClearedCount = payments.filter(
    (p) => p.status !== "Failed",
  ).length;
  const complianceRate =
    payments.length > 0
      ? Math.round((complianceClearedCount / payments.length) * 100)
      : 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-1 text-indigo-glow">
            Liquidity Overview
          </h2>
          <p className="text-sm text-on-surface-variant">
            Real-time cross-border settlement metrics.
          </p>
        </div>
        <div className="font-mono text-sm text-on-surface-variant flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {new Date().toUTCString()}
        </div>
      </div>

      {/* Row 1: KPIs (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              TOTAL SETTLED VOLUME
            </span>
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-on-surface leading-none mb-2">
              $
              {totalSettledVolume.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8.4% this week</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              ACTIVE FX LOCKS
            </span>
            <span className="material-symbols-outlined text-indigo-400">
              currency_exchange
            </span>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-on-surface leading-none mb-2">
              {activeLocksCount}{" "}
              <span className="text-sm text-on-surface-variant font-normal">
                active
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Expiring soon</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              DAILY LIMIT UTILIZATION
            </span>
            <span className="font-mono text-sm text-on-surface">
              {dailyLimitUtilization}%
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className="w-full bg-surface-container-highest rounded-full h-1.5 mb-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                style={{ width: `${dailyLimitUtilization}%` }}
              ></div>
            </div>
            <div className="font-mono text-[12px] text-on-surface-variant text-right">
              $640,000 / $1,000,000
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-32 transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              COMPLIANCE STATUS
            </span>
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-mono text-2xl font-bold text-emerald-400 leading-none mb-2">
              {complianceRate}%
            </div>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>
                Cleared ({payments.filter((p) => p.status === "Failed").length}{" "}
                flagged)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts & Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart (8 cols) */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-8 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              PAYMENT VOLUME BY CURRENCY
            </span>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded text-xs font-medium bg-surface-variant text-on-surface">
                1W
              </button>
              <button className="px-2 py-1 rounded text-xs font-medium text-on-surface-variant hover:text-on-surface">
                1M
              </button>
              <button className="px-2 py-1 rounded text-xs font-medium text-on-surface-variant hover:text-on-surface">
                YTD
              </button>
            </div>
          </div>
          <div className="flex-1 relative w-full h-full bg-surface-container-highest/20 rounded-lg border border-outline-variant/10 flex items-end overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
            <svg
              className="absolute bottom-0 left-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <path
                d="M0,100 L0,70 Q20,80 40,50 T80,40 T100,20 L100,100 Z"
                fill="rgba(99, 102, 241, 0.1)"
                stroke="#6366F1"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <div className="absolute bottom-0 left-0 w-full h-px bg-outline-variant/20"></div>
          </div>
        </div>

        {/* Limits (4 cols) */}
        <div className="glass-panel rounded-xl p-6 lg:col-span-4 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              CORPORATE EXPOSURE LIMITS
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              tune
            </span>
          </div>
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* EUR */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded bg-surface-variant flex items-center justify-center text-[10px] font-bold">
                    EUR
                  </div>
                  <span className="text-sm text-on-surface">Eurozone</span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant">
                  75%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-400 h-1.5 rounded-full w-[75%] shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
              </div>
            </div>
            {/* GBP */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded bg-surface-variant flex items-center justify-center text-[10px] font-bold">
                    GBP
                  </div>
                  <span className="text-sm text-on-surface">
                    United Kingdom
                  </span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant">
                  40%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-1.5 rounded-full w-[40%] shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
              </div>
            </div>
            {/* SGD */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded bg-surface-variant flex items-center justify-center text-[10px] font-bold">
                    SGD
                  </div>
                  <span className="text-sm text-on-surface">Singapore</span>
                </div>
                <span className="font-mono text-xs text-amber-400 font-bold">
                  90%
                </span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden relative">
                <div className="bg-amber-400 h-1.5 rounded-full w-[90%] shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Table */}
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container/30">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            RECENT CROSS-BORDER PAYMENTS
          </span>
          <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-xs font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">
              Loading payments...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              No payments found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/50">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Payment ID
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Beneficiary
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Destination
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Network
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {payments.map((payment) => (
                  <tr
                    key={payment.payment_id}
                    className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors group"
                  >
                    <td className="px-5 py-4 font-mono text-indigo-300">
                      {payment.payment_id.substring(0, 8).toUpperCase()}...
                    </td>
                    <td className="px-5 py-4 font-medium text-on-surface">
                      {payment.beneficiary_name}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      {payment.currency}
                    </td>
                    <td className="px-5 py-4 font-mono text-right text-on-surface">
                      {payment.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">
                      <span className="px-2 py-1 bg-surface-variant rounded text-[10px] font-bold">
                        SWIFT
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={payment.status} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() =>
                          navigate(`/payments/${payment.payment_id}`)
                        }
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div className="p-4 bg-surface-container/30 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Showing {payments.length} payments
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors text-xs flex items-center gap-1 opacity-50 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button className="px-3 py-1.5 rounded border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors text-xs flex items-center gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
