import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, processRecharge } from "../services/api";
import RechargeForm from "../components/recharge/RechargeForm";
import PlanGrid from "../components/recharge/PlanGrid";
import BalanceCard from "../components/recharge/BalanceCard";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function RechargeFormPage() {
  const [account, setAccount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0); // Used to force re-render form when plan is selected
  const [initialFormValues, setInitialValues] = useState({
    rechargeType: "Mobile",
    accountNumber: "",
    operatorName: "",
    amount: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getDashboard();
        setAccount(data.linked_account);
      } catch (err) {
        console.error("Failed to fetch account details", err);
      }
    };
    fetchAccount();
  }, []);

  const handleSelectPlan = (amount) => {
    setInitialValues((prev) => ({
      ...prev,
      amount: amount.toString(),
    }));
    setFormKey((prev) => prev + 1);
  };

  const handleSubmitRecharge = async (formData) => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await processRecharge(
        formData.accountNumber,
        formData.operatorName,
        formData.amount,
      );
      // Navigate to confirmation page with transaction details
      navigate("/recharge/confirm", {
        state: {
          transaction: {
            transactionId: res.transactionId,
            status: res.status,
            bbpsReferenceId: res.bbpsReferenceId,
            operatorReferenceId: res.operatorReferenceId,
            created_at: res.created_at,
            amount: formData.amount,
            accountNumber: formData.accountNumber,
            operatorName: formData.operatorName,
          },
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Recharge transaction failed. Please check your balance and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/recharge")}
        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-semibold transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Balance Card */}
      {account && <BalanceCard account={account} />}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Transaction Failed</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recharge Form */}
        <div className="lg:col-span-7">
          <RechargeForm
            key={formKey}
            onSubmit={handleSubmitRecharge}
            initialValues={initialFormValues}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right: Popular Plans */}
        <div className="lg:col-span-5">
          <PlanGrid onSelectPlan={handleSelectPlan} />
        </div>
      </div>
    </div>
  );
}
