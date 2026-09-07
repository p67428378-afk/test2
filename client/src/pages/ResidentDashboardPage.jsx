import React, { useState, useEffect } from "react";
import { UserCheck, QrCode, RefreshCw } from "lucide-react";
import ResidentVisitorForm from "../components/ResidentVisitorForm";
import ActiveQRCodeCard from "../components/ActiveQRCodeCard";
import { getVisitorPreApprovals } from "../services/api";

export default function ResidentDashboardPage() {
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorList, setVisitorList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const data = await getVisitorPreApprovals("Unit 4B");
      setVisitorList(data);
      if (data.length > 0 && !selectedVisitor) {
        setSelectedVisitor(data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch visitor pre-approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleVisitorCreated = (newVisitor) => {
    setSelectedVisitor(newVisitor);
    fetchVisitors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Resident Portal & Visitor Pre-Approval
          </h1>
          <p className="text-sm text-slate-600">
            Pre-approve guests and manage single-use time-bound QR gate passes.
          </p>
        </div>
        <button
          onClick={fetchVisitors}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResidentVisitorForm onVisitorCreated={handleVisitorCreated} />
        </div>
        <div>
          <ActiveQRCodeCard visitor={selectedVisitor} />
        </div>
      </div>

      {/* Visitor Pre-Approval History Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Pre-Approved Visitors History (Unit 4B)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Visitor Name</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Validity Window</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">View QR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitorList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    No pre-approval records found for Unit 4B.
                  </td>
                </tr>
              ) : (
                visitorList.map((v) => (
                  <tr
                    key={v.visitor_id || v.id}
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      selectedVisitor?.visitor_id === v.visitor_id
                        ? "bg-blue-50/60 font-medium"
                        : ""
                    }`}
                    onClick={() => setSelectedVisitor(v)}
                  >
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {v.visitor_name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {v.contact_phone || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {v.vehicle_number || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {new Date(v.valid_from).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(v.valid_until).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : v.status === "USED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVisitor(v);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium py-1 px-2.5 rounded flex items-center gap-1 ml-auto"
                      >
                        <QrCode className="w-3 h-3" /> View Token
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
