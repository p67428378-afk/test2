import React, { useState, useEffect } from "react";
import GroupHeaderBanner from "../components/expenses/GroupHeaderBanner";
import NetBalanceMetricGroup from "../components/expenses/NetBalanceMetricGroup";
import DebtMatrixCard from "../components/expenses/DebtMatrixCard";
import ExpenseTable from "../components/expenses/ExpenseTable";
import { getGroupBalances, getExpenses } from "../services/api";
import { RefreshCw, AlertCircle } from "lucide-react";

export const GroupDashboardPage = ({ selectedGroup, onReloadGroup }) => {
  const [balancesData, setBalancesData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    if (!selectedGroup?.id) return;
    setLoading(true);
    setError("");
    try {
      const [balancesRes, expensesRes] = await Promise.all([
        getGroupBalances(selectedGroup.id),
        getExpenses(selectedGroup.id),
      ]);
      setBalancesData(balancesRes);
      setExpenses(expensesRes || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load group balance and expense data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedGroup?.id]);

  if (!selectedGroup) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          No Group Selected
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Create or select an expense group from the top navigation bar to get
          started.
        </p>
      </div>
    );
  }

  const totalExpensesSum = expenses.reduce(
    (acc, curr) => acc + (Number(curr.total_amount) || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <GroupHeaderBanner
        group={selectedGroup}
        totalExpenses={totalExpensesSum}
        onMemberAdded={onReloadGroup}
      />

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <p className="text-sm font-medium">
            Calculating shares and group balances...
          </p>
        </div>
      ) : (
        <>
          <NetBalanceMetricGroup
            netBalances={balancesData?.net_balances || []}
          />

          <DebtMatrixCard
            simplifiedSettlements={balancesData?.simplified_settlements || []}
            groupId={selectedGroup.id}
          />

          <ExpenseTable
            expenses={expenses}
            members={selectedGroup.members || []}
          />
        </>
      )}
    </div>
  );
};

export default GroupDashboardPage;
