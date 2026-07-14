import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getQueue,
  removeFromQueue,
  updateQueueItem,
  getUploadSettings,
  saveUploadSettings,
  base64ToFile,
} from "../services/queueService.js";
import { uploadDamagePhotos } from "../services/api.js";
import QueuePhotoCard from "../components/claims/QueuePhotoCard.jsx";

export default function UploadQueuePage({ onBack }) {
  const [queue, setQueue] = useState([]);
  const [settings, setSettings] = useState({ uploadOverCellular: false });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load queue and settings on mount
  useEffect(() => {
    setQueue(getQueue());
    setSettings(getUploadSettings());

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Toggle cellular upload setting
  const handleToggleCellular = () => {
    const newSettings = { uploadOverCellular: !settings.uploadOverCellular };
    setSettings(newSettings);
    saveUploadSettings(newSettings);
  };

  // Remove item from queue
  const handleRemove = (id) => {
    removeFromQueue(id);
    setQueue(getQueue());
  };

  // Retry uploading a failed item
  const handleRetry = async (id) => {
    const item = queue.find((q) => q.id === id);
    if (!item || !item.base64) return;

    updateQueueItem(id, { status: "uploading", progress: 10 });
    setQueue(getQueue());

    try {
      const file = base64ToFile(item.base64, item.name);
      await uploadDamagePhotos([file]);
      updateQueueItem(id, { status: "complete", progress: 100 });
      setTimeout(() => {
        removeFromQueue(id);
        setQueue(getQueue());
      }, 1000);
    } catch (err) {
      updateQueueItem(id, { status: "failed", progress: 0 });
      setQueue(getQueue());
    }
  };

  // Force upload all pending/failed items now
  const handleForceUploadAll = async () => {
    const itemsToUpload = queue.filter(
      (q) => q.status === "pending" || q.status === "failed",
    );
    if (itemsToUpload.length === 0) return;

    for (const item of itemsToUpload) {
      await handleRetry(item.id);
    }
  };

  const canForceUpload =
    isOnline &&
    queue.some((q) => q.status === "pending" || q.status === "failed");

  return (
    <div className="w-[390px] h-[844px] bg-surface relative overflow-hidden flex flex-col shadow-2xl rounded-[32px] border border-surface-container-high mx-auto">
      {/* TopAppBar */}
      <header className="bg-surface-lowest flex items-center justify-between px-4 h-16 w-full shrink-0 z-50 border-b border-outline-variant/20">
        <button
          onClick={onBack}
          aria-label="Back"
          className="p-2 -ml-2 text-primary hover:bg-surface-container-high rounded-full transition-colors duration-200"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-title-lg text-title-lg font-bold text-primary flex-1 text-center">
          Upload Queue
        </h1>
        <div
          className={`flex items-center border px-3 py-1 rounded-full space-x-1 ${
            isOnline
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-secondary-container/10 border-secondary text-secondary"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isOnline ? "cloud_queue" : "cloud_off"}
          </span>
          <span className="font-label-sm text-label-sm">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* Queue Status Banner */}
        <div className="bg-secondary-container/10 border border-secondary rounded-xl p-4 flex items-start space-x-3">
          <span className="material-symbols-outlined text-secondary shrink-0">
            info
          </span>
          <p className="font-body-md text-body-md text-on-surface">
            {isOnline
              ? "You are online. You can force upload queued photos or wait for automatic sync."
              : "You are currently offline. Photos are queued and will automatically upload when a stable Wi-Fi connection is detected."}
          </p>
        </div>

        {/* Queued Photos List */}
        <div className="space-y-4">
          {queue.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl block mb-2">
                photo_library
              </span>
              <p className="font-body-md">No photos in the upload queue.</p>
            </div>
          ) : (
            queue.map((item) => (
              <QueuePhotoCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onRetry={handleRetry}
              />
            ))
          )}
        </div>

        {/* Settings Card */}
        <div className="bg-surface-lowest border border-outline-variant rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-title-lg text-title-lg text-on-surface">
              Upload over Cellular Data
            </h3>
            {/* Toggle Switch */}
            <button
              onClick={handleToggleCellular}
              aria-checked={settings.uploadOverCellular}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                settings.uploadOverCellular
                  ? "bg-primary"
                  : "bg-surface-container-high"
              }`}
              role="switch"
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  settings.uploadOverCellular
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            By default, uploads only occur on Wi-Fi to save data. Toggle this on
            to upload immediately using cellular data.
          </p>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="absolute bottom-0 w-full bg-surface-lowest border-t border-outline-variant p-4 space-y-3 z-50">
        <div className="flex flex-col">
          <button
            onClick={handleForceUploadAll}
            disabled={!canForceUpload}
            className={`w-full font-label-md text-label-md py-3 rounded-lg flex items-center justify-center transition-colors ${
              canForceUpload
                ? "bg-primary text-on-primary hover:bg-primary/90 cursor-pointer"
                : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
            }`}
          >
            Force Upload Now
          </button>
          {!isOnline && (
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center mt-2">
              Connect to network to force upload
            </p>
          )}
        </div>
        <button
          onClick={onBack}
          className="w-full bg-surface-lowest border border-outline-variant text-primary font-label-md text-label-md py-3 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center"
        >
          Back to Claim Estimate
        </button>
      </div>
    </div>
  );
}

UploadQueuePage.propTypes = {
  onBack: PropTypes.func.isRequired,
};
