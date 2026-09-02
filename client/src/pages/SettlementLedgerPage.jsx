import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SettlementForm from "../components/settlements/SettlementForm";
import SettlementLedgerTable from "../components/settlements/SettlementLedgerTable";
import { getGroupSettlements } from "../services/api";
import { RefreshCw, AlertCircle } from "lucide-react";

export const SettlementLedgerPage = ({ selectedGroup }) => {
  const [searchParams] = useSearchParams();
  const initialPayerId = searchParams.get("payer_id") || "";
  const initialPayeeId = searchParams.get("payee_id") || "";
  const initialAmount = searchParams.get("amount") || "";

  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSettlements = async () => {
    if (!selectedGroup?.id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getGroupSettlements(selectedGroup.id);
      setSettlements(data || []);
    } catch (err) {
      console.error("Failed to load settlements:", err);
      setError("Failed to load settlement history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettlements();
  }, [selectedGroup?.id]);

  if (!selectedGroup) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center max-w-lg mx-auto my-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          No Group Selected
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Please select a group to view settlements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettlementForm
        group={selectedGroup}
        initialPayerId={initialPayerId}
        initialPayeeId={initialPayeeId}
        initialAmount={initialAmount}
        onSettlementCreated={loadSettlements}
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
            onClick={loadSettlements}
            className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
          <p className="text-sm font-medium">
            Loading settlement ledger history...
          </p>
        </div>
      ) : (
        <SettlementLedgerTable
          settlements={settlements}
          members={selectedGroup.members || []}
        />
      )}
    </div>
  );
};

export default SettlementLedgerPage;
