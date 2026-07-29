import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusSquare } from "lucide-react";
import ItemForm from "../components/items/ItemForm.jsx";

export default function ReportItemPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <PlusSquare className="text-[#6366F1] w-8 h-8" />
          Report Lost or Found Item
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Provide details about the item to help us match it with reported
          items.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6">
        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm text-center">
            Item reported successfully! Redirecting to dashboard...
          </div>
        ) : (
          <ItemForm onSuccess={handleSuccess} onCancel={() => navigate("/")} />
        )}
      </div>
    </div>
  );
}
