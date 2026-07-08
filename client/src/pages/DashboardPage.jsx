import React, { useState, useEffect } from "react";
import KPIGrid from "../components/roundups/KPIGrid";
import GrowthChart from "../components/roundups/GrowthChart";
import TransactionTable from "../components/roundups/TransactionTable";
import ImpactCalculator from "../components/roundups/ImpactCalculator";
import {
  getRoundupSummary,
  getTransactions,
  triggerDailyJob,
} from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [triggering, setTriggering] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryData, txData] = await Promise.all([
        getRoundupSummary(),
        getTransactions(skip, limit),
      ]);
      setSummary(summaryData || null);
      setTransactions(txData?.items || []);
      setTotalTransactions(txData?.total || 0);
    } catch (err) {
      console.error(err);
      setError("Could not load round-up data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [skip]);

  const handleTriggerJob = async () => {
    try {
      setTriggering(true);
      const result = await triggerDailyJob();
      if (
        result &&
        (result.processed_users_count > 0 || result.total_invested_amount > 0)
      ) {
        setNotification(
          `Today's round-ups ($${result.total_invested_amount.toFixed(2)}) have been invested.`,
        );
      } else {
        setNotification(
          "Daily job executed. No pending round-ups to invest today.",
        );
      }
      loadData();
    } catch (err) {
      console.error(err);
      setNotification("Failed to trigger daily investment job.");
    } finally {
      setTriggering(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background text-on-surface">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-margin-desktop pb-margin-desktop w-full max-w-7xl mx-auto flex flex-col gap-lg">
      {/* Error Alert */}
      {error && (
        <div
          className="bg-error-container/20 border border-error/30 rounded-lg p-4 flex items-center gap-3 text-error"
          data-testid="error-banner"
        >
          <span className="text-xl">⚠️</span>
          <p className="font-body-md text-body-md">{error}</p>
          <button
            onClick={loadData}
            className="ml-auto bg-error/10 hover:bg-error/20 px-3 py-1 rounded text-xs font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div
          className="bg-primary-container/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3"
          data-testid="notification-banner"
        >
          <span className="text-xl">🎉</span>
          <p className="font-body-md text-body-md text-on-surface">
            {notification}
          </p>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="text-lg font-bold">&times;</span>
          </button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Portfolio Dashboard
          </h1>
          <p className="text-on-surface-variant text-sm">
            Monitor your passive micro-investments and portfolio growth.
          </p>
        </div>
        <button
          onClick={handleTriggerJob}
          disabled={triggering}
          className="bg-primary text-on-primary hover:bg-primary-fixed font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {triggering ? "Processing..." : "Trigger Daily Job"}
        </button>
      </div>

      {/* KPI Grid */}
      <KPIGrid summary={summary} />

      {/* Charts & Calculator */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-md">
        <div className="xl:col-span-8 flex flex-col gap-md">
          <GrowthChart />
        </div>
        <div className="xl:col-span-4">
          <ImpactCalculator />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={transactions}
        total={totalTransactions}
        skip={skip}
        limit={limit}
        onPageChange={(newPage) => setSkip((newPage - 1) * limit)}
      />
    </div>
  );
}
