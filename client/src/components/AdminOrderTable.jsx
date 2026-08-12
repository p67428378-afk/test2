import React, { useState } from "react";
import {
  Shield,
  Truck,
  PackageCheck,
  AlertCircle,
  Plus,
  Edit,
  Sparkles,
  Check,
} from "lucide-react";
import { adminPaintingService } from "../services/api.js";

export default function AdminOrderTable({
  orders = [],
  paintings = [],
  onRefresh,
}) {
  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'paintings'
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [statusVal, setStatusVal] = useState("Shipped");
  const [trackingVal, setTrackingVal] = useState("1Z9999999999999999");
  const [msg, setMsg] = useState("");

  // New Painting Form state
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("Master Artist");
  const [newMedium, setNewMedium] = useState("Oil on Canvas");
  const [newStyle, setNewStyle] = useState("Abstract");
  const [newPrice, setNewPrice] = useState("350.00");
  const [is1of1, setIs1of1] = useState(false);
  const [isConfigurable, setIsConfigurable] = useState(true);
  const [newStock, setNewStock] = useState(1);
  const [newImg, setNewImg] = useState(
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
  );

  const handleUpdateOrder = async (orderId) => {
    setMsg("");
    try {
      await adminPaintingService.updateOrderStatus(orderId, {
        status: statusVal,
        tracking_number: trackingVal,
      });
      setMsg(
        `Order status updated to '${statusVal}' with tracking '${trackingVal}'. Dispatch notification triggered.`,
      );
      setEditingOrderId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      setMsg("Failed to update order status.");
    }
  };

  const handleCreatePainting = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await adminPaintingService.createPainting({
        title: newTitle,
        artist_name: newArtist,
        medium: newMedium,
        style: newStyle,
        base_price: parseFloat(newPrice),
        is_original_one_of_one: is1of1,
        is_configurable: isConfigurable,
        stock_quantity: Number(newStock),
        image_url: newImg,
        status: "ACTIVE",
      });
      setMsg(`New artwork listing '${newTitle}' published to catalog!`);
      setNewTitle("");
      onRefresh();
    } catch (err) {
      console.error(err);
      setMsg("Failed to create artwork listing.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-amber-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Admin Catalog & Order Fulfillment Portal
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "orders"
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Manage Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("paintings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "paintings"
                ? "bg-amber-500 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Artwork Catalog Listings ({paintings.length})
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* TAB 1: ORDERS FULFILLMENT TABLE */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Order No</th>
                  <th className="p-3.5">Customer Email</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Fulfillment Status</th>
                  <th className="p-3.5">Tracking Number</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isEditing = editingOrderId === order.id;

                    return (
                      <tr key={order.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-slate-100 font-mono">
                          {order.order_number}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          {order.customer_email}
                        </td>
                        <td className="p-3.5 font-extrabold text-amber-400">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          {isEditing ? (
                            <select
                              value={statusVal}
                              onChange={(e) => setStatusVal(e.target.value)}
                              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="In Production">
                                In Production
                              </option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono">
                          {isEditing ? (
                            <input
                              type="text"
                              value={trackingVal}
                              onChange={(e) => setTrackingVal(e.target.value)}
                              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                            />
                          ) : (
                            order.tracking_number || "—"
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          {isEditing ? (
                            <button
                              onClick={() => handleUpdateOrder(order.id)}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                            >
                              Save Status
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingOrderId(order.id);
                                setStatusVal(order.status || "Shipped");
                                setTrackingVal(
                                  order.tracking_number || "1Z9999999999999999",
                                );
                              }}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold text-xs rounded-lg transition-colors"
                            >
                              Update Order
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ARTWORK LISTINGS & ADD NEW FORM */}
      {activeTab === "paintings" && (
        <div className="space-y-8">
          {/* New Painting Form */}
          <form
            onSubmit={handleCreatePainting}
            className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Publish New Artwork Listing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400">Artwork Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Celestial Horizon"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Artist Name</label>
                <input
                  type="text"
                  required
                  value={newArtist}
                  onChange={(e) => setNewArtist(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400">Art Style</label>
                <select
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Abstract">Abstract</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Modern">Modern</option>
                  <option value="Impressionist">Impressionist</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Medium</label>
                <select
                  value={newMedium}
                  onChange={(e) => setNewMedium(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Oil on Canvas">Oil on Canvas</option>
                  <option value="Acrylic on Canvas">Acrylic on Canvas</option>
                  <option value="Watercolor">Watercolor</option>
                  <option value="Mixed Media">Mixed Media</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={is1of1}
                  onChange={(e) => setIs1of1(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 rounded"
                />
                1-of-1 Original Piece
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={isConfigurable}
                  onChange={(e) => setIsConfigurable(e.target.checked)}
                  className="h-4 w-4 accent-amber-500 rounded"
                />
                Configurable Dimensions
              </label>

              <button
                type="submit"
                className="ml-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Publish Artwork Listing
              </button>
            </div>
          </form>

          {/* Current Catalog Listings */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Artist</th>
                  <th className="p-3.5">Style / Medium</th>
                  <th className="p-3.5">Base Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Attributes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {paintings.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-slate-100">
                      {p.title}
                    </td>
                    <td className="p-3.5">
                      {p.artist_name || "Featured Artist"}
                    </td>
                    <td className="p-3.5">
                      {p.style} &bull; {p.medium}
                    </td>
                    <td className="p-3.5 font-extrabold text-amber-400">
                      ${parseFloat(p.base_price).toFixed(2)}
                    </td>
                    <td className="p-3.5 font-bold">
                      {p.stock_quantity < 1 ? (
                        <span className="text-rose-400">Sold Out (0)</span>
                      ) : (
                        <span className="text-emerald-400">
                          {p.stock_quantity} available
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 flex gap-1.5">
                      {p.is_original_one_of_one && (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">
                          1-of-1
                        </span>
                      )}
                      {p.is_configurable && (
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded">
                          Configurable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
