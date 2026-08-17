import React from "react";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { MapPin, Calendar, Tag, ArrowRight } from "lucide-react";

export const ItemTable = ({ items = [], loading = false }) => {
  const getStatusBadge = (status, type) => {
    const s = (status || "").toLowerCase();
    const t = (type || "").toLowerCase();

    if (s === "reunited") return <Badge variant="success">Reunited</Badge>;
    if (s === "claimed" || s === "claim_pending")
      return <Badge variant="warning">Claim Pending</Badge>;
    if (t === "lost") return <Badge variant="danger">Lost Item</Badge>;
    return <Badge variant="info">Found Item</Badge>;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2"></div>
        <p className="text-sm">Loading items...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <Tag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-800">No items found</h3>
        <p className="text-sm text-slate-500 mt-1">
          There are no reports matching the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Item Details</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Date Incident</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y border-slate-200 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs">
                  <div className="font-semibold text-slate-800 line-clamp-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${
                      item.type === "lost"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {item.date_incident
                        ? new Date(item.date_incident).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  {getStatusBadge(item.status, item.type)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/items/${item.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    View Matches <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;
