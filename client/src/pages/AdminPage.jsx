import React, { useState, useEffect } from "react";
import AdminOrderTable from "../components/AdminOrderTable.jsx";
import { adminPaintingService, paintingService } from "../services/api.js";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const ordersRes = await adminPaintingService.getAdminOrders();
      setOrders(ordersRes || []);

      const catalogRes = await paintingService.getPaintings({ limit: 100 });
      setPaintings(catalogRes.items || []);
    } catch (err) {
      console.error("Admin fetch error", err);
      setError("Failed to load admin portal data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        Loading Admin Fulfillment & Catalog Management Portal...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <AdminOrderTable
        orders={orders}
        paintings={paintings}
        onRefresh={fetchData}
      />
    </div>
  );
}
