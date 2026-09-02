import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  FileText,
  ArrowLeftRight,
} from "lucide-react";

export const SettlementLedgerTable = ({ settlements = [], members = [] }) => {
  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : memberId;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Settlement Ledger History
          </h2>
          <p className="text-xs text-slate-500">
            Historical log of all completed debt settlement payments
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {settlements.length} {settlements.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {settlements.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <ArrowLeftRight className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-700">
            No settlement transfers logged yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Use the form above to record payments between group members.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Payer (From)</th>
                <th className="py-3.5 px-6 text-center">Transfer</th>
                <th className="py-3.5 px-6">Payee (To)</th>
                <th className="py-3.5 px-6 text-right">Amount</th>
                <th className="py-3.5 px-6">Notes</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {settlements.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-mono text-xs">
                    <span className="inline-flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {item.date}
                    </span>
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                    {getMemberName(item.payer_id)}
                  </td>

                  <td className="py-4 px-6 text-center text-slate-400 whitespace-nowrap">
                    <ArrowRight className="w-4 h-4 mx-auto text-emerald-600" />
                  </td>

                  <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                    {getMemberName(item.payee_id)}
                  </td>

                  <td className="py-4 px-6 text-right font-extrabold text-emerald-700 whitespace-nowrap">
                    ${Number(item.amount).toFixed(2)}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-500">
                    {item.notes ? (
                      <span className="inline-flex items-center">
                        <FileText className="w-3 h-3 mr-1 text-slate-400" />
                        {item.notes}
                      </span>
                    ) : (
                      <span className="text-slate-300 italic">None</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SettlementLedgerTable;
