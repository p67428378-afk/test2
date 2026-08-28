import React from "react";
import { Calendar, HeartPulse, User, Clock, RefreshCw } from "lucide-react";

export default function LeaveBalanceWidget({
  balances,
  loading,
  error,
  onRefresh,
}) {
  const getLeaveTypeMeta = (type) => {
    switch (type) {
      case "VACATION":
        return {
          title: "Vacation Leave",
          icon: <Calendar className="w-5 h-5 text-blue-600" />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          badgeColor: "bg-green-100 text-green-800",
          defaultAlloc: 15,
        };
      case "SICK":
        return {
          title: "Sick Leave",
          icon: <HeartPulse className="w-5 h-5 text-red-600" />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badgeColor: "bg-green-100 text-green-800",
          defaultAlloc: 10,
        };
      case "PERSONAL":
        return {
          title: "Personal Leave",
          icon: <User className="w-5 h-5 text-amber-600" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          badgeColor: "bg-green-100 text-green-800",
          defaultAlloc: 5,
        };
      case "UNPAID":
        return {
          title: "Unpaid Leave",
          icon: <Clock className="w-5 h-5 text-purple-600" />,
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          badgeColor: "bg-blue-100 text-blue-800",
          defaultAlloc: 0,
        };
      default:
        return {
          title: type,
          icon: <Calendar className="w-5 h-5 text-gray-600" />,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeColor: "bg-gray-100 text-gray-800",
          defaultAlloc: 0,
        };
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E3E8F0] p-4 rounded-xl shadow-sm animate-pulse h-28"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-7 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between w-full">
        <div>
          <p className="font-semibold text-sm">Failed to load leave balances</p>
          <p className="text-xs text-red-600 mt-0.5">{error}</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        )}
      </div>
    );
  }

  const items = balances && balances.length > 0 ? balances : [];

  if (items.length === 0) {
    return (
      <div className="bg-white border border-[#E3E8F0] p-6 rounded-xl text-center text-[#707A8C] w-full">
        No balance records found for the current year.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {items.map((bal) => {
        const meta = getLeaveTypeMeta(bal.leave_type);
        const isUnpaid = bal.leave_type === "UNPAID";
        return (
          <div
            key={bal.leave_type}
            className="bg-white border border-[#E3E8F0] p-4 rounded-xl shadow-sm hover:shadow-md transition duration-150 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${meta.bgColor}`}>
                  {meta.icon}
                </div>
                <span className="text-xs font-medium text-[#707A8C]">
                  {meta.title}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.badgeColor}`}
              >
                {isUnpaid
                  ? `${bal.used_days} Used`
                  : `${bal.remaining_days}/${bal.allocated_days} Avail`}
              </span>
            </div>

            <div className="mt-1 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-bold text-[#171C29]">
                  {isUnpaid ? bal.used_days : bal.remaining_days}
                </span>
                <span className="text-sm font-medium text-[#707A8C] ml-1.5">
                  Days {isUnpaid ? "Taken" : "Remaining"}
                </span>
              </div>
              {!isUnpaid && (
                <span className="text-xs text-[#707A8C]">
                  {bal.used_days} used
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
