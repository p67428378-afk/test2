import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../components/lost-found/ReportForm";
import { itemService } from "../services/api";
import { ArrowLeft } from "lucide-react";

export const ReportItemPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (payload) => {
    setLoading(true);
    try {
      const createdItem = await itemService.reportItem(payload);
      if (createdItem && createdItem.id) {
        navigate(`/items/${createdItem.id}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Submit Lost or Found Item Report
          </h1>
          <p className="text-xs text-slate-500">
            Provide detailed information to trigger automated AI match scoring.
          </p>
        </div>
      </div>

      <ReportForm onSubmit={handleFormSubmit} loading={loading} />
    </div>
  );
};

export default ReportItemPage;
