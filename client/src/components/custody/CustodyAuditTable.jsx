import React from "react";
import { ShieldCheck, ArrowRight, User, Calendar, MapPin } from "lucide-react";

export default function CustodyAuditTable({
  transfers = [],
  selectedArtifactCode = null,
}) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-stone-200 pb-3">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-900" />
            <span>Immutable Chain of Custody Transfer Audit Trail</span>
          </h3>
          <p className="text-xs text-stone-500">
            {selectedArtifactCode
              ? `Displaying custody history for Artifact ${selectedArtifactCode}`
              : "Complete history of artifact location changes and custodian transfers"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        <table className="w-full text-xs text-left text-stone-700 font-mono">
          <thead className="bg-stone-100 uppercase text-stone-500 font-bold border-b border-stone-200">
            <tr>
              <th className="p-3">Artifact</th>
              <th className="p-3">Storage Location (Room/Rack/Bin)</th>
              <th className="p-3">Releasing Custodian</th>
              <th className="p-3">Receiving Custodian</th>
              <th className="p-3">UTC Timestamp</th>
              <th className="p-3">Transfer Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {transfers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-stone-500 italic font-sans"
                >
                  No custody transfers recorded yet.
                </td>
              </tr>
            ) : (
              transfers.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-amber-900">
                    {t.artifact_code || t.artifact_id}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded font-semibold flex items-center space-x-1 w-fit">
                      <MapPin className="w-3 h-3 text-amber-800" />
                      <span>
                        {t.room_name
                          ? `${t.room_name} / R-${t.rack_number} / Bin-${t.bin_number}`
                          : t.container_code || "In Transit"}
                      </span>
                    </span>
                  </td>
                  <td className="p-3 text-stone-600">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-stone-400" />
                      <span>
                        {t.releasing_custodian_name ||
                          t.releasing_custodian_id ||
                          "Field Officer"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-stone-800">
                    <div className="flex items-center space-x-1 text-emerald-800">
                      <ArrowRight className="w-3 h-3 text-emerald-600" />
                      <span>
                        {t.receiving_custodian_name || t.receiving_custodian_id}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-stone-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(
                          t.transfer_timestamp || t.created_at,
                        ).toUTCString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-stone-600 max-w-xs truncate font-sans">
                    {t.notes || "Routine custody transfer"}
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
