import React, { useState, useEffect } from "react";
import KPIStatsGrid from "../components/dashboard/KPIStatsGrid";
import TrendChart from "../components/dashboard/TrendChart";
import CurrencyDonut from "../components/dashboard/CurrencyDonut";
import RecentSweepsTable from "../components/dashboard/RecentSweepsTable";
import SlideOutPanel from "../components/common/SlideOutPanel";
import {
  getAccounts,
  createAccount,
  getDashboardStats,
  getDashboardCharts,
  getActivityLogs,
} from "../services/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [logs, setLogs] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [error, setError] = useState("");

  // Form state for new account
  const [name, setName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [balance, setBalance] = useState("");
  const [bankProvider, setBankProvider] = useState("");
  const [isHub, setIsHub] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, chartsData, logsData, accountsData] = await Promise.all(
        [
          getDashboardStats(),
          getDashboardCharts(),
          getActivityLogs({ limit: 10 }),
          getAccounts(),
        ],
      );
      setStats(statsData);
      setCharts(chartsData);
      setLogs(logsData.logs);
      setAccounts(accountsData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createAccount({
        name,
        account_number: accountNumber,
        currency,
        balance: parseFloat(balance),
        bank_provider: bankProvider,
        is_hub: isHub,
      });
      setIsPanelOpen(false);
      // Reset form
      setName("");
      setAccountNumber("");
      setCurrency("EUR");
      setBalance("");
      setBankProvider("");
      setIsHub(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create account");
    }
  };

  return (
    <div className="space-y-grid-margin">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">
            Treasury Overview
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Real-time liquidity and FX hedging status
          </p>
        </div>
        <button
          onClick={() => setIsPanelOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-primary-fixed transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Bank Account
        </button>
      </div>

      <KPIStatsGrid stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        <TrendChart trendData={charts?.trend} loading={loading} />
        <CurrencyDonut
          distribution={charts?.currency_distribution}
          loading={loading}
        />
      </div>

      {/* Accounts List */}
      <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
        <div className="p-md border-b border-outline-variant bg-surface-container/50">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            Bank Accounts
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-highest/30 border-b border-outline-variant">
                <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Account Number
                </th>
                <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-right">
                  Balance
                </th>
                <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Bank Provider
                </th>
                <th className="px-sm py-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-center">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50 font-mono text-data-mono">
              {accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-sm py-8 text-center text-on-surface-variant"
                  >
                    No bank accounts configured.
                  </td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr
                    key={acc.id}
                    className="hover:bg-surface-container-high/30 transition-colors"
                  >
                    <td className="px-sm py-sm text-on-surface">{acc.name}</td>
                    <td className="px-sm py-sm text-on-surface-variant">
                      {acc.account_number}
                    </td>
                    <td className="px-sm py-sm text-on-surface">
                      {acc.currency}
                    </td>
                    <td className="px-sm py-sm text-on-surface text-right">
                      {acc.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-sm py-sm text-on-surface-variant">
                      {acc.bank_provider}
                    </td>
                    <td className="px-sm py-sm text-center">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 rounded-sm font-label-caps text-[10px] ${
                          acc.is_hub
                            ? "bg-secondary/10 text-secondary"
                            : "bg-tertiary/10 text-tertiary"
                        }`}
                      >
                        {acc.is_hub ? "Central Hub" : "Operating"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecentSweepsTable logs={logs} loading={loading} />

      <SlideOutPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        title="Add Bank Account"
      >
        <form onSubmit={handleCreateAccount} className="space-y-4">
          {error && (
            <div className="p-3 bg-error/10 border border-error text-error rounded-DEFAULT text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Account Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. EUR Operating (Germany)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Account Number
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. DE89370400440532013000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Initial Balance
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Bank Provider
            </label>
            <input
              type="text"
              required
              value={bankProvider}
              onChange={(e) => setBankProvider(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-DEFAULT px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
              placeholder="e.g. Deutsche Bank"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHub"
              checked={isHub}
              onChange={(e) => setIsHub(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary bg-surface-container"
            />
            <label
              htmlFor="isHub"
              className="text-sm font-medium text-on-surface"
            >
              Is Central Hub Account?
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-on-primary font-semibold rounded-DEFAULT hover:bg-primary-fixed transition-colors"
          >
            Create Account
          </button>
        </form>
      </SlideOutPanel>
    </div>
  );
}
