import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getGroups, getGroupSettlements } from "../services/api";
import SettlementCard from "../components/settlements/SettlementCard";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import {
  ArrowRightLeft,
  Users,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
} from "lucide-react";

export default function SettlementsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlGroupId = searchParams.get("groupId") || "";

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(urlGroupId);
  const [settlementData, setSettlementData] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingSettlements, setLoadingSettlements] = useState(false);
  const [error, setError] = useState(null);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroupsList = async () => {
      try {
        setLoadingGroups(true);
        setError(null);
        const data = await getGroups();
        setGroups(data || []);
        if (data?.length > 0) {
          const initialId =
            urlGroupId && data.some((g) => g.id === urlGroupId)
              ? urlGroupId
              : data[0].id;
          setSelectedGroupId(initialId);
        }
      } catch (err) {
        setError("Failed to load groups for settlements.");
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroupsList();
  }, [urlGroupId]);

  // Fetch settlements whenever selectedGroupId changes
  const fetchSettlements = async (groupId) => {
    if (!groupId) return;
    try {
      setLoadingSettlements(true);
      setError(null);
      const data = await getGroupSettlements(groupId);
      setSettlementData(data);
    } catch (err) {
      setError("Failed to calculate group settlements.");
    } finally {
      setLoadingSettlements(false);
    }
  };

  useEffect(() => {
    if (selectedGroupId) {
      setSearchParams({ groupId: selectedGroupId });
      fetchSettlements(selectedGroupId);
    }
  }, [selectedGroupId]);

  const currentGroup = groups.find((g) => g.id === selectedGroupId);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val) || 0);
  };

  const balances = settlementData?.balances || [];
  const settlements = settlementData?.settlements || [];

  const totalTransfersAmount = settlements.reduce(
    (sum, s) => sum + (Number(s.amount) || 0),
    0,
  );

  if (loadingGroups) {
    return (
      <div className="text-center py-20 bg-white border border-[#E3E8F0] rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-sm text-[#707A8C]">Loading groups & balances...</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white border border-[#E3E8F0] rounded-xl shadow-sm">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#171C29]">
          No Groups Available
        </h2>
        <p className="text-sm text-[#707A8C] mt-1 max-w-sm mx-auto">
          Create a group and add expenses to see individual balances and
          simplified settlement plans.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create a Group
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header & Group Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171C29] tracking-tight">
            Balances & Settlement Plan
          </h1>
          <p className="text-sm text-[#707A8C] mt-1">
            Calculated net balances and debt simplification to settle up with
            minimum transfers.
          </p>
        </div>

        {/* Group Dropdown & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="text-sm font-semibold bg-white border border-[#E3E8F0] rounded-xl px-4 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => fetchSettlements(selectedGroupId)}
            disabled={loadingSettlements}
            className="p-2.5 text-[#707A8C] hover:text-[#171C29] bg-white hover:bg-gray-50 border border-[#E3E8F0] rounded-xl transition-colors shadow-sm"
            title="Recalculate Balances"
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingSettlements ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Participants"
          value={`${balances.length} Members`}
          subtitle={`In ${currentGroup?.name || "Group"}`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Required Transfers"
          value={`${settlements.length} Transfers`}
          subtitle="Minimum payments to settle"
          icon={ArrowRightLeft}
          color="purple"
        />
        <StatCard
          title="Total Settlement Volume"
          value={formatCurrency(totalTransfersAmount)}
          subtitle="Sum of pending debt transfers"
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Settlement Calculation Error
            </p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {loadingSettlements ? (
        <div className="text-center py-16 bg-white border border-[#E3E8F0] rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-[#707A8C]">
            Computing individual net shares & settlement plan...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Member Net Balances */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#171C29]">
                Member Net Balances
              </h2>
              <span className="text-xs text-[#707A8C]">Aggregated Ledger</span>
            </div>

            <div className="bg-white border border-[#E3E8F0] rounded-xl p-4 shadow-sm divide-y divide-[#E3E8F0]">
              {balances.length === 0 ? (
                <p className="text-sm text-[#707A8C] py-4 text-center">
                  No members or expenses found for this group.
                </p>
              ) : (
                balances.map((b) => {
                  const net = Number(b.net_balance) || 0;
                  const isPositive = net > 0.005;
                  const isNegative = net < -0.005;

                  return (
                    <div
                      key={b.member_id}
                      className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {b.member_name?.substring(0, 2).toUpperCase() || "MB"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#171C29]">
                            {b.member_name}
                          </p>
                          <p className="text-[11px] text-[#707A8C]">
                            {isPositive
                              ? "Gets back money"
                              : isNegative
                                ? "Owes money"
                                : "Settled up"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1 font-bold text-sm">
                          {isPositive && (
                            <span className="text-green-600 flex items-center">
                              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />+
                              {formatCurrency(net)}
                            </span>
                          )}
                          {isNegative && (
                            <span className="text-red-600 flex items-center">
                              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />-
                              {formatCurrency(Math.abs(net))}
                            </span>
                          )}
                          {!isPositive && !isNegative && (
                            <span className="text-gray-500">$0.00</span>
                          )}
                        </div>
                        <Badge
                          variant={
                            isPositive
                              ? "success"
                              : isNegative
                                ? "error"
                                : "neutral"
                          }
                          size="sm"
                        >
                          {isPositive
                            ? "To Receive"
                            : isNegative
                              ? "To Pay"
                              : "Even"}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Simplified Settlement Plan Transfers */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#171C29]">
                Simplified Settlement Plan ({settlements.length})
              </h2>
              <span className="text-xs text-[#707A8C]">
                Optimized Transfers
              </span>
            </div>

            {settlements.length === 0 ? (
              <div className="bg-white border border-[#E3E8F0] rounded-xl p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#171C29]">
                  All Balances are Settled!
                </h3>
                <p className="text-sm text-[#707A8C] mt-1 max-w-sm mx-auto">
                  There are currently no outstanding debts among members in this
                  group.
                </p>
                <div className="mt-4">
                  <Link
                    to={`/expenses/new?groupId=${selectedGroupId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Record New Expense
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map((s, idx) => (
                  <SettlementCard
                    key={`${s.from_member}-${s.to_member}-${idx}`}
                    settlement={s}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
