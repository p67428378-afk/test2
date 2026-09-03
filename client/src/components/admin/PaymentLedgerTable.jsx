import React from "react";
import {
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function PaymentLedgerTable({
  payments = [],
  sessions = [],
  packages = [],
}) {
  // Mock recent ledger rows matching DesignSpec
  const defaultLedger = [
    {
      id: "1",
      session_id: "#104",
      client: "Samantha Reed",
      paid: 875.0,
      total: 1750.0,
      status: "Partial",
    },
    {
      id: "2",
      session_id: "#103",
      client: "Michael Chang",
      paid: 350.0,
      total: 350.0,
      status: "Paid",
    },
    {
      id: "3",
      session_id: "#102",
      client: "Jessica Taylor",
      paid: 0.0,
      total: 500.0,
      status: "Pending",
    },
    {
      id: "4",
      session_id: "#101",
      client: "Robert Chen",
      paid: 1200.0,
      total: 1200.0,
      status: "Paid",
    },
  ];

  const defaultPackages = [
    {
      name: "Wedding Package",
      details: "6 hrs coverage • 100 edited photos",
      price: 1200.0,
    },
    {
      name: "Portrait Package",
      details: "1 hr coverage • 15 edited photos",
      price: 350.0,
    },
    {
      name: "Family Session",
      details: "2 hrs coverage • 35 edited photos",
      price: 500.0,
    },
  ];

  const pkgList = packages.length > 0 ? packages : defaultPackages;

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border border-stone-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs text-stone-500 font-medium">
            Total Studio Revenue
          </p>
          <p className="text-2xl font-bold text-[#775A19] mt-1">$48,250.00</p>
        </div>
        <div className="p-4 border border-stone-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs text-stone-500 font-medium">Active Packages</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">
            {pkgList.length}
          </p>
        </div>
        <div className="p-4 border border-stone-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs text-stone-500 font-medium">
            Completed Sessions
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">28</p>
        </div>
        <div className="p-4 border border-stone-200 rounded-xl bg-white shadow-sm">
          <p className="text-xs text-stone-500 font-medium">
            Outstanding Balance
          </p>
          <p className="text-2xl font-bold text-red-600 mt-1">$2,625.00</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Catalog Section */}
        <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-sm">
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C5A059]" />
            Package Management
          </h3>
          <div className="space-y-3">
            {pkgList.map((pkg, idx) => (
              <div
                key={idx}
                className="p-3 border border-stone-200 rounded-xl flex justify-between items-center hover:bg-stone-50"
              >
                <div>
                  <p className="font-bold text-stone-900 text-sm">{pkg.name}</p>
                  <p className="text-xs text-stone-500">
                    {pkg.deliverables_summary || pkg.details}
                  </p>
                </div>
                <p className="font-bold text-[#775A19] text-sm">
                  ${(pkg.price || 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Ledger Table */}
        <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-sm">
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#C5A059]" />
            Recent Payment Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-2.5">Session ID</th>
                  <th className="p-2.5">Client</th>
                  <th className="p-2.5">Paid Amount</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {defaultLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-stone-50">
                    <td className="p-2.5 font-bold text-stone-900">
                      {row.session_id}
                    </td>
                    <td className="p-2.5 text-stone-700">{row.client}</td>
                    <td className="p-2.5 font-mono font-medium">
                      ${row.paid.toFixed(2)}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 text-2xs font-bold rounded-md ${
                          row.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : row.status === "Partial"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
