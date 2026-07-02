import React from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import StatusTimeline from "../components/tracking/StatusTimeline";
import Badge from "../components/common/Badge";
import { shipmentService } from "../services/api";
import { Search, Package, MapPin, User } from "lucide-react";

export default function TrackPackagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingId, setTrackingId] = React.useState("");
  const [shipment, setShipment] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleTrack = async (idToTrack) => {
    const id = idToTrack || trackingId;
    if (!id) return;

    setIsLoading(true);
    setError("");
    setShipment(null);
    try {
      const data = await shipmentService.trackShipment(id);
      setShipment(data);
      setSearchParams({ id });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Shipment not found. Please verify the tracking ID.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setTrackingId(idFromUrl);
      handleTrack(idFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  return (
    <AppLayout title="Track Package">
      <div className="space-y-8 max-w-4xl">
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Enter unique tracking ID (e.g. TRK-XXXXXX)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Tracking..." : "Track"}
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        {shipment && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipment Details Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 h-fit">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tracking ID
                </span>
                <h3 className="text-xl font-mono font-bold text-indigo-600 mt-1">
                  {shipment.tracking_id}
                </h3>
                <div className="mt-2">
                  <Badge status={shipment.status} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Sender
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {shipment.sender_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Recipient
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">
                      {shipment.recipient_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {shipment.destination_city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="lg:col-span-2">
              <StatusTimeline history={shipment.tracking_history} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
