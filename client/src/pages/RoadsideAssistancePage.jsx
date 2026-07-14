import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { requestTowDispatch, getDispatchStatus } from "../services/api.js";
import CancelRequestButton from "../components/claims/CancelRequestButton.jsx";

export default function RoadsideAssistancePage({ claimId, onBack }) {
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [idempotencyKey] = useState(
    () => "idemp-" + Math.random().toString(36).substring(2, 15),
  );

  // Default GPS coordinates for accident scene (e.g., San Francisco)
  const [gps] = useState({ latitude: 37.7749, longitude: -122.4194 });

  const handleRequestTow = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestTowDispatch(
        claimId,
        gps.latitude,
        gps.longitude,
        idempotencyKey,
      );
      setDispatch(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to request tow truck dispatch.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Poll dispatch status if active
  useEffect(() => {
    if (
      !dispatch ||
      dispatch.status === "cancelled" ||
      dispatch.status === "completed"
    ) {
      return;
    }

    let intervalId;
    const fetchStatus = async () => {
      try {
        const data = await getDispatchStatus(dispatch.dispatch_id);
        setDispatch((prev) => ({
          ...prev,
          status: data.status,
          resolved_address: data.resolved_address,
          tow_truck: data.tow_truck || prev.tow_truck,
        }));

        if (data.status === "cancelled" || data.status === "completed") {
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Failed to fetch dispatch status", err);
      }
    };

    intervalId = setInterval(fetchStatus, 5000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <header className="w-full top-0 sticky bg-surface flex justify-between items-center px-4 h-16 z-10 border-b border-outline-variant/20">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="cursor-pointer active:scale-95 transition-transform hover:opacity-80 text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">
          Roadside Assistance
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {!dispatch ? (
          <div className="bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-md flex flex-col gap-4 text-center">
            <span className="material-symbols-outlined text-primary text-5xl">
              local_shipping
            </span>
            <h2 className="text-xl font-bold text-primary">
              Request Roadside Tow
            </h2>
            <p className="text-body-md text-on-surface-variant">
              We will dispatch a professional tow truck to your exact GPS
              location.
            </p>

            <div className="bg-surface-container-low p-3 rounded-lg text-left text-xs text-on-surface-variant flex flex-col gap-1">
              <div className="flex justify-between">
                <span className="font-semibold">GPS Latitude:</span>
                <span>{gps.latitude}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">GPS Longitude:</span>
                <span>{gps.longitude}</span>
              </div>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm flex items-center gap-2 text-left">
                <span className="material-symbols-outlined text-error">
                  error
                </span>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleRequestTow}
              disabled={loading}
              className="w-full bg-primary text-on-primary font-button text-button py-4 rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Requesting Dispatch..." : "Confirm Tow Request"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Dispatch Status Card */}
            <div className="bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-md flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Status
                  </span>
                  <h3 className="text-lg font-bold text-primary capitalize">
                    {dispatch.status}
                  </h3>
                </div>
                <div className="bg-primary-container/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                  ETA: {dispatch.eta || "Calculating..."}
                </div>
              </div>

              {dispatch.tow_truck && (
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-on-surface text-sm">
                    Tow Truck Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-4 rounded-lg text-sm">
                    <div>
                      <span className="text-xs text-on-surface-variant block">
                        Driver Name
                      </span>
                      <span className="font-medium text-on-surface">
                        {dispatch.tow_truck.driver_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant block">
                        License Plate
                      </span>
                      <span className="font-medium text-on-surface">
                        {dispatch.tow_truck.license_plate}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-on-surface-variant block">
                        Phone Number
                      </span>
                      <span className="font-medium text-on-surface">
                        {dispatch.tow_truck.phone_number}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {dispatch.resolved_address && (
                <div>
                  <span className="text-xs text-on-surface-variant block">
                    Dispatch Address
                  </span>
                  <p className="text-sm font-medium text-on-surface">
                    {dispatch.resolved_address}
                  </p>
                </div>
              )}

              {/* Simulated Map */}
              <div className="w-full h-48 bg-surface-container-high rounded-xl relative overflow-hidden flex items-center justify-center border border-outline-variant">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="flex flex-col items-center gap-2 z-10">
                  <span className="material-symbols-outlined text-primary text-4xl animate-bounce">
                    pin_drop
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Live Tracking Map
                  </span>
                </div>
              </div>

              {dispatch.status !== "cancelled" &&
                dispatch.status !== "completed" && (
                  <CancelRequestButton
                    dispatchId={dispatch.dispatch_id}
                    onCancelSuccess={() =>
                      setDispatch((prev) => ({ ...prev, status: "cancelled" }))
                    }
                  />
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

RoadsideAssistancePage.propTypes = {
  claimId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};
