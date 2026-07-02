import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Printer,
  ShieldCheck,
} from "lucide-react";

export default function RechargeConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;

  if (!transaction) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100 max-w-md mx-auto mt-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Transaction Found
        </h2>
        <p className="text-gray-500 mb-6">
          We couldn't find any transaction details to display.
        </p>
        <Link
          to="/recharge"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  const isSuccess = transaction.status === "RECHARGED";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Status Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div
          className={`p-8 text-center text-white ${isSuccess ? "bg-green-600" : "bg-red-600"}`}
        >
          {isSuccess ? (
            <CheckCircle className="w-20 h-10 mx-auto mb-4 animate-bounce" />
          ) : (
            <AlertCircle className="w-20 h-10 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isSuccess ? "Recharge Successful!" : "Recharge Failed"}
          </h1>
          <p className="opacity-90 mt-2 text-lg">
            {isSuccess
              ? `Your recharge of ₹${transaction.amount} was processed successfully.`
              : "The transaction could not be completed."}
          </p>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
            Transaction Receipt
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 font-medium">
                Account / Mobile Number
              </p>
              <p className="text-base font-bold text-gray-900 mt-1">
                {transaction.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Operator Name</p>
              <p className="text-base font-bold text-gray-900 mt-1">
                {transaction.operatorName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Recharge Amount</p>
              <p className="text-lg font-extrabold text-primary-700 mt-1">
                ₹{transaction.amount}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">
                Transaction Date & Time
              </p>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {new Date(transaction.created_at).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="md:col-span-2 border-t border-dashed border-gray-100 pt-4">
              <p className="text-gray-500 font-medium">
                Transaction ID (UUID v4)
              </p>
              <p className="text-base font-mono font-bold text-gray-900 mt-1 break-all">
                {transaction.transactionId}
              </p>
            </div>
            {transaction.bbpsReferenceId && (
              <div>
                <p className="text-gray-500 font-medium">BBPS Reference ID</p>
                <p className="text-base font-mono font-bold text-gray-900 mt-1">
                  {transaction.bbpsReferenceId}
                </p>
              </div>
            )}
            {transaction.operatorReferenceId && (
              <div>
                <p className="text-gray-500 font-medium">
                  Operator Reference ID
                </p>
                <p className="text-base font-mono font-bold text-gray-900 mt-1">
                  {transaction.operatorReferenceId}
                </p>
              </div>
            )}
          </div>

          {/* BBPS Compliance Footer */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-xs text-blue-800">
            <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider">
                BBPS Compliance & Safety
              </p>
              <p className="mt-1 leading-relaxed">
                This transaction is processed securely through the Bharat Bill
                Payment System (BBPS) network in compliance with RBI Master
                Directions for PPIs and NPCI Biller Registration Norms.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <button
              onClick={() => window.print()}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => navigate("/recharge")}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
