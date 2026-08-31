import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  Truck,
  ThermometerSnowflake,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles,
} from "lucide-react";
import { getOrder } from "../services/api";

export const OrderConfirmationPage = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrder(order_id);
        setOrder(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err.message ||
            "Order could not be retrieved.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (order_id) {
      fetchOrderData();
    }
  }, [order_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-[#E8E2DC] shadow-sm animate-pulse space-y-6">
          <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto" />
          <div className="h-6 bg-stone-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-stone-200 rounded w-1/3 mx-auto" />
          <div className="h-32 bg-stone-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E8E2DC] shadow-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-heading text-xl font-bold text-[#2D1B18] mb-2">
            Order Record Not Found
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            {error || "Unable to load order confirmation details."}
          </p>
          <Link
            to="/chocolates"
            className="inline-flex items-center px-5 py-2.5 bg-[#2D1B18] text-[#D4AF37] rounded-xl text-sm font-bold shadow hover:bg-[#1A0F0D]"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  const isThermal = order.shipping_method === "express_thermal";

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl border border-[#E8E2DC] p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#F4E8C1] text-[#2D1B18] uppercase tracking-wider mb-3">
            Artisanal Order Confirmed
          </span>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2D1B18] leading-tight">
            Thank you, {order.customer_name}!
          </h1>

          <p className="mt-2 text-sm text-stone-600 max-w-lg mx-auto">
            Your rare cacao selection is being handcrafted and prepared for
            temperature-controlled shipping.
          </p>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 bg-[#FDFBF7] px-6 py-4 rounded-2xl border border-[#E8E2DC]">
            <div className="text-left">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                Order Code
              </span>
              <span className="font-mono text-base font-bold text-[#2D1B18]">
                {order.order_code}
              </span>
            </div>

            <div className="h-8 w-px bg-[#E8E2DC] hidden sm:block" />

            <div className="text-left">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                Order Status
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                <Package className="w-3.5 h-3.5 mr-1" />
                {order.order_status || order.status || "Processing"}
              </span>
            </div>

            <div className="h-8 w-px bg-[#E8E2DC] hidden sm:block" />

            <div className="text-left">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                Order UUID
              </span>
              <span className="font-mono text-xs text-stone-600">
                {order.id || order.order_id}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Receipt */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Items & Financial Breakdown */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-heading text-lg font-bold text-[#2D1B18] pb-3 border-b border-[#E8E2DC] flex items-center justify-between">
              <span>Itemized Tasting Receipt</span>
              <button
                onClick={() => window.print()}
                className="text-xs font-semibold text-stone-500 hover:text-[#2D1B18] flex items-center transition-colors"
              >
                <Printer className="w-3.5 h-3.5 mr-1" />
                Print
              </button>
            </h3>

            {/* Item list */}
            <div className="divide-y divide-[#E8E2DC]">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const unitPrice =
                    item.unit_price || item.chocolate?.price || 0;
                  const itemTotal =
                    item.item_subtotal !== null &&
                    item.item_subtotal !== undefined
                      ? item.item_subtotal
                      : unitPrice * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="py-4 flex justify-between items-center text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2D1B18] text-white flex items-center justify-center text-lg flex-shrink-0">
                          🍫
                        </div>
                        <div>
                          <span className="font-bold text-[#2D1B18] block">
                            {item.chocolate?.title || "Single-Origin Cacao Bar"}
                          </span>
                          <span className="text-stone-500">
                            Qty: {item.quantity} &times; $
                            {Number(unitPrice).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-[#2D1B18]">
                        ${Number(itemTotal).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-stone-500 py-4">
                  Chocolates included in order.
                </p>
              )}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[#E8E2DC] space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal Amount</span>
                <span className="font-semibold text-[#2D1B18]">
                  ${Number(order.subtotal_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Shipping Fee (
                  {isThermal ? "Express Thermal" : "Standard Ground"})
                </span>
                <span className="font-semibold text-[#2D1B18]">
                  {order.shipping_fee > 0
                    ? `$${Number(order.shipping_fee).toFixed(2)}`
                    : "FREE"}
                </span>
              </div>
              <div className="pt-3 border-t border-[#E8E2DC] flex justify-between items-center text-sm">
                <span className="font-bold text-[#2D1B18]">Total Paid</span>
                <span className="font-heading text-2xl font-bold text-[#2D1B18]">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Info */}
          <div className="md:col-span-5 space-y-6">
            {/* Delivery address & packaging card */}
            <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-sm space-y-5">
              <h3 className="font-heading text-base font-bold text-[#2D1B18] pb-3 border-b border-[#E8E2DC] flex items-center">
                <Truck className="w-4 h-4 mr-2 text-[#D4AF37]" />
                Delivery Information
              </h3>

              <div className="text-xs space-y-3">
                <div>
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] block">
                    Customer
                  </span>
                  <span className="font-semibold text-[#2D1B18] block">
                    {order.customer_name}
                  </span>
                  <span className="text-stone-600">{order.customer_email}</span>
                </div>

                <div>
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] block">
                    Shipping Destination
                  </span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {order.shipping_address}
                  </p>
                </div>

                <div>
                  <span className="text-stone-400 uppercase tracking-wider text-[10px] block">
                    Selected Shipping Method
                  </span>
                  <span className="font-bold text-[#2D1B18] block mt-0.5">
                    {isThermal
                      ? "Express Thermal Delivery (+Cold Pack)"
                      : "Standard Ground Shipping"}
                  </span>
                </div>
              </div>

              {/* Thermal Shield Banner */}
              {isThermal ? (
                <div className="p-4 bg-[#E0F2F1] rounded-2xl border border-[#00796B]/20 text-xs text-[#00796B] space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <ThermometerSnowflake className="w-4 h-4" />
                    <span>Cold-Chain Protection Active</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    Insulated thermal pouch &amp; ice gel pack enclosed to
                    maintain freshness below 21°C (70°F).
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <span>Standard ambient ground shipping.</span>
                </div>
              )}
            </div>

            {/* Explore more button */}
            <Link
              to="/chocolates"
              className="w-full py-4 px-6 bg-[#2D1B18] text-[#D4AF37] hover:bg-[#1A0F0D] rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Continue Exploring Chocolates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
