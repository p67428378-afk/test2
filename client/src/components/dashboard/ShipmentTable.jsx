import React from "react";
import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { Search, Eye, UserCheck, RefreshCw } from "lucide-react";

export default function ShipmentTable({
  shipments,
  onAssignClick,
  onStatusClick,
  isAdmin,
}) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredShipments = shipments.filter(
    (s) =>
      s.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination_city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <h3 className="font-bold text-gray-800">Shipment Directory</h3>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Tracking ID</th>
              <th className="px-6 py-3">Recipient</th>
              <th className="px-6 py-3">Destination</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Booked Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
            {filteredShipments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-400"
                >
                  No shipments found.
                </td>
              </tr>
            ) : (
              filteredShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-semibold text-indigo-600">
                    {shipment.tracking_id}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {shipment.recipient_name}
                  </td>
                  <td className="px-6 py-4">{shipment.destination_city}</td>
                  <td className="px-6 py-4">
                    <Badge status={shipment.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(shipment.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      to={`/track?id=${shipment.tracking_id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Track
                    </Link>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onAssignClick(shipment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          Assign
                        </button>
                        <button
                          onClick={() => onStatusClick(shipment)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Status
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
