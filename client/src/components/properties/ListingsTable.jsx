import React from "react";

export default function ListingsTable({ listings, onEdit, onDelete }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]">
        <h3 className="text-lg font-semibold text-white">Active Portfolio</h3>
        <div className="text-xs text-[#bbcabf]">
          Showing {listings.length} properties
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0F172A] border-b border-[#334155]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Beds/Baths
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-[#F8FAFC] divide-y divide-[#334155]/50">
            {listings.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-[#bbcabf]"
                >
                  No listings found. Create your first listing!
                </td>
              </tr>
            ) : (
              listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-[#0F172A]/50 transition-colors group"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {listing.address}
                  </td>
                  <td className="px-4 py-4">
                    ${Number(listing.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-[#bbcabf] capitalize">
                    {listing.property_type}
                  </td>
                  <td className="px-4 py-4 text-[#bbcabf]">
                    {listing.bedrooms} Bed / {listing.bathrooms} Bath
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        listing.status === "ACTIVE"
                          ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30"
                          : listing.status === "PENDING"
                            ? "bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/30"
                            : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(listing)}
                        className="text-[#bbcabf] hover:text-[#4edea3] transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(listing.id)}
                        className="text-[#bbcabf] hover:text-[#ffb4ab] transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
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
