import React from "react";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Gift,
  ThumbsUp,
} from "lucide-react";

export default function ApplicationsTable({
  applications,
  onSelectApplication,
  onViewOffer,
}) {
  const getStatusBadge = (status, offerStatus) => {
    if (status === "Approved" && offerStatus === "Offer Made") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <Gift className="w-3 h-3 mr-1" />
          Offer Made
        </span>
      );
    }
    if (status === "Approved" && offerStatus === "Offer Accepted") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
          <ThumbsUp className="w-3 h-3 mr-1" />
          Offer Accepted
        </span>
      );
    }

    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case "Under Review":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Submitted
          </span>
        );
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 text-sm">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Requested Amount</th>
              <th className="px-6 py-4">Offered Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Submitted At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {applications.map((app) => {
              const isOfferMade =
                app.status === "Approved" && app.offer_status === "Offer Made";
              return (
                <tr
                  key={app.application_id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {app.product_name}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${parseFloat(app.requested_amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">
                    {app.offered_amount
                      ? `$${parseFloat(app.offered_amount).toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(app.status, app.offer_status)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(app.submitted_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isOfferMade && onViewOffer && (
                      <button
                        onClick={() => onViewOffer(app)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors mr-2"
                      >
                        View Offer
                      </button>
                    )}
                    {onSelectApplication && (
                      <button
                        onClick={() => onSelectApplication(app)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-xs"
                      >
                        Evaluate
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
