import React from "react";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";

export default function BalanceCard({ account }) {
  if (!account) return null;

  const formattedBalance = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(account.balance);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
          <Wallet className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Linked Savings Account
          </p>
          <p className="text-lg font-bold text-gray-800">
            {account.account_number}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:items-end">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Available Balance
        </p>
        <p className="text-2xl font-extrabold text-primary-700">
          {formattedBalance}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
        <CheckCircle className="w-4 h-4" />
        <span>{account.status}</span>
      </div>
    </div>
  );
}
