import React, { useState } from "react";
import {
  Calendar,
  Tag,
  User,
  Divide,
  Receipt,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Badge from "../common/Badge";

export default function ExpenseTable({ expenses = [], onAddExpenseClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  const categories = [
    "ALL",
    ...new Set(expenses.map((e) => e.category).filter(Boolean)),
  ];

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.payer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedExpenseId((prev) => (prev === id ? null : id));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val) || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getSplitBadgeVariant = (type) => {
    switch (type) {
      case "EQUAL":
        return "primary";
      case "PERCENTAGE":
        return "purple";
      case "FIXED":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="bg-white border border-[#E3E8F0] rounded-xl shadow-sm overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-[#E3E8F0] flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses, payers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="category-select"
            className="text-xs font-medium text-[#707A8C] shrink-0"
          >
            Category:
          </label>
          <select
            id="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm bg-white border border-[#E3E8F0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#171C29]">
            No expenses found
          </h3>
          <p className="text-sm text-[#707A8C] mt-1 max-w-sm mx-auto">
            {expenses.length === 0
              ? "No shared expenses recorded for this group yet."
              : "No expenses match your search criteria."}
          </p>
          {onAddExpenseClick && (
            <button
              type="button"
              onClick={onAddExpenseClick}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              Record First Expense
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E3E8F0] bg-gray-50/75 text-[#707A8C] text-xs uppercase font-semibold">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid By</th>
                <th className="py-3 px-4">Split Rule</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8F0] text-sm text-[#171C29]">
              {filteredExpenses.map((exp) => {
                const isExpanded = expandedExpenseId === exp.id;
                return (
                  <React.Fragment key={exp.id}>
                    <tr className="hover:bg-blue-50/30 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#707A8C]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(exp.expense_date)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#171C29]">
                        {exp.title}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs text-[#707A8C]">
                          <Tag className="w-3 h-3 text-gray-400" />
                          {exp.category || "General"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                            {(exp.payer_name || "U")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-[#171C29]">
                            {exp.payer_name || "Member"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={getSplitBadgeVariant(exp.split_type)}
                          size="sm"
                        >
                          {exp.split_type}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#171C29] whitespace-nowrap">
                        {formatCurrency(exp.total_amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleExpand(exp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          {exp.splits?.length || 0} Shares
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Split Share Breakdown Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50/80">
                        <td
                          colSpan="7"
                          className="py-3 px-6 border-b border-[#E3E8F0]"
                        >
                          <div className="text-xs font-semibold text-[#707A8C] uppercase mb-2">
                            Individual Shares Breakdown
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                            {exp.splits?.map((s) => (
                              <div
                                key={s.id || s.member_id}
                                className="bg-white border border-[#E3E8F0] rounded-lg p-2.5 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-semibold text-[10px] flex items-center justify-center">
                                    {(s.member_name || "M")
                                      .substring(0, 2)
                                      .toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-[#171C29] text-xs">
                                      {s.member_name || "Participant"}
                                    </p>
                                    {exp.split_type === "PERCENTAGE" && (
                                      <p className="text-[10px] text-[#707A8C]">
                                        {s.split_value}% share
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className="font-bold text-xs text-[#171C29]">
                                  {formatCurrency(s.computed_amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
