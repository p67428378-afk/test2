import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGroup, getExpenses } from "../services/api";
import ExpenseTable from "../components/expenses/ExpenseTable";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import {
  ChevronRight,
  Plus,
  ArrowRightLeft,
  DollarSign,
  Receipt,
  Users,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const [groupData, expensesData] = await Promise.all([
        getGroup(groupId),
        getExpenses({ group_id: groupId }),
      ]);

      setGroup(groupData);
      setExpenses(expensesData || []);
    } catch (err) {
      setError("Failed to load group details or expenses.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      loadData(true);
    }
  }, [groupId]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  const totalSpent = expenses.reduce(
    (sum, e) => sum + (Number(e.total_amount) || 0),
    0,
  );
  const membersCount = group?.members?.length || 0;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val) || 0);
  };

  if (loading) {
    return (
      <div className="text-center py-20 bg-white border border-[#E3E8F0] rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-sm text-[#707A8C]">
          Loading group expenses ledger...
        </p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">
              Error Loading Group
            </h3>
            <p className="text-sm text-red-700 mt-1">
              {error || "Group not found."}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => loadData(true)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Retry
              </button>
              <Link
                to="/"
                className="px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Back to Groups
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#707A8C]">
        <Link to="/" className="hover:text-blue-600 font-medium">
          Groups
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-[#171C29]">{group.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-500">Expenses Ledger</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white border border-[#E3E8F0] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#171C29]">{group.name}</h1>
            <Badge variant="primary" size="md">
              {membersCount} {membersCount === 1 ? "member" : "members"}
            </Badge>
          </div>
          {group.description && (
            <p className="text-sm text-[#707A8C] mt-1 max-w-2xl">
              {group.description}
            </p>
          )}

          {/* Members List */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#707A8C] font-medium">
              Participants:
            </span>
            {group.members?.map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
              >
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                  {m.name.substring(0, 1).toUpperCase()}
                </span>
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 text-[#707A8C] hover:text-[#171C29] bg-gray-50 hover:bg-gray-100 border border-[#E3E8F0] rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <Link
            to={`/settlements?groupId=${group.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Settlements Plan
          </Link>
          <Link
            to={`/expenses/new?groupId=${group.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Expense
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Group Expenses"
          value={formatCurrency(totalSpent)}
          subtitle="Across all recorded expenses"
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Recorded Expenses"
          value={`${expenses.length} Entries`}
          subtitle="Shared transactions"
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Group Participants"
          value={`${membersCount} People`}
          subtitle="Splitting shared expenses"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Expenses Table Component */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#171C29]">Expenses Ledger</h2>
        </div>
        <ExpenseTable
          expenses={expenses}
          onAddExpenseClick={() =>
            navigate(`/expenses/new?groupId=${group.id}`)
          }
        />
      </div>
    </div>
  );
}
