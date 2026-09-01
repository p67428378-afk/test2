import React, { useState, useEffect } from "react";
import {
  FilePlus,
  Plus,
  Trash2,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createInvoice } from "../../services/api";

export default function InvoiceForm({ onInvoiceCreated }) {
  const [formData, setFormData] = useState({
    appointment_id: "",
    patient_id: "",
    payment_status: "Pending",
  });

  const [lineItems, setLineItems] = useState([
    { description: "Consultation Fee", amount: 150 },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [...prev, { description: "", amount: 0 }]);
  };

  const handleRemoveLineItem = (index) => {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLineItemChange = (index, field, value) => {
    setLineItems((prev) => {
      const updated = [...prev];
      updated[index][field] = field === "amount" ? Number(value) : value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const totalAmount = calculateTotal();
      const payload = {
        appointment_id: formData.appointment_id,
        patient_id: formData.patient_id,
        total_amount: totalAmount,
        line_items: lineItems,
        payment_status: formData.payment_status,
      };

      const res = await createInvoice(payload);
      setSuccessMsg(`Invoice generated! ID: ${res.id}`);
      setFormData({
        appointment_id: "",
        patient_id: "",
        payment_status: "Pending",
      });
      setLineItems([{ description: "Consultation Fee", amount: 150 }]);

      if (onInvoiceCreated) onInvoiceCreated(res);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to generate invoice";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <FilePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Itemized Invoice Generator
          </h2>
          <p className="text-xs text-slate-500">
            Generate medical procedure & consultation invoices
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Appointment UUID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              value={formData.appointment_id}
              onChange={(e) =>
                setFormData({ ...formData, appointment_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Patient UUID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440001"
              value={formData.patient_id}
              onChange={(e) =>
                setFormData({ ...formData, patient_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Initial Payment Status
          </label>
          <select
            value={formData.payment_status}
            onChange={(e) =>
              setFormData({ ...formData, payment_status: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Itemized Line Items */}
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Itemized Charges</span>
            <button
              type="button"
              onClick={handleAddLineItem}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Item description (e.g. Lab Test: CBC)"
                  value={item.description}
                  onChange={(e) =>
                    handleLineItemChange(index, "description", e.target.value)
                  }
                  className="col-span-7 px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
                <div className="col-span-4 relative">
                  <DollarSign className="h-3.5 w-3.5 absolute left-2 top-2 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={item.amount}
                    onChange={(e) =>
                      handleLineItemChange(index, "amount", e.target.value)
                    }
                    className="w-full pl-7 pr-2 py-1.5 border border-slate-300 rounded bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLineItem(index)}
                  className="col-span-1 text-slate-400 hover:text-rose-600 flex justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-800">
            <span>Total Invoice Amount:</span>
            <span className="text-indigo-600">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FilePlus className="h-4 w-4" />
            )}
            <span>Generate & Issue Invoice</span>
          </button>
        </div>
      </form>
    </div>
  );
}
