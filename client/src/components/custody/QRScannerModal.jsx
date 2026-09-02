import React, { useState, useEffect, useRef } from "react";
import { Camera, X, CheckCircle, AlertCircle, QrCode } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [manualCode, setManualCode] = useState("");
  const [scannedResult, setScannedResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setScannedResult(null);
      setCameraError(null);
      return;
    }

    // Try initializing Html5QrcodeScanner if container element exists
    try {
      const scanner = new Html5QrcodeScanner(
        "qr-reader-container",
        { fps: 10, qrbox: { width: 220, height: 220 } },
        false,
      );

      scanner.render(
        (decodedText) => {
          setScannedResult(decodedText);
          onScanSuccess(decodedText);
          try {
            scanner.clear();
          } catch (e) {}
        },
        (error) => {
          // Normal frame scanning miss, ignore
        },
      );

      scannerRef.current = scanner;
    } catch (err) {
      console.warn("Camera QR scanner fallback mode:", err);
      setCameraError(
        "Camera access unavailable or blocked. Use manual QR code entry below.",
      );
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {}
      }
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setScannedResult(manualCode);
    onScanSuccess(manualCode);
    setManualCode("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-4 relative">
        <div className="flex justify-between items-center border-b border-stone-200 pb-3">
          <h3 className="text-lg font-bold text-amber-900 flex items-center space-x-2">
            <QrCode className="w-5 h-5" />
            <span>Launch QR Camera Scanner</span>
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Container */}
        <div className="bg-stone-900 rounded-lg p-3 min-h-[260px] flex flex-col items-center justify-center relative overflow-hidden">
          <div id="qr-reader-container" className="w-full text-white text-xs" />

          {cameraError && (
            <div className="text-center text-amber-200 p-4 space-y-2">
              <Camera className="w-10 h-10 mx-auto text-amber-400" />
              <p className="text-xs font-medium">{cameraError}</p>
            </div>
          )}

          {scannedResult && (
            <div className="absolute inset-0 bg-emerald-950/90 text-white flex flex-col items-center justify-center p-4 space-y-2 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <p className="text-sm font-bold">
                QR / Barcode Scanned Successfully!
              </p>
              <p className="text-xs font-mono bg-emerald-900/80 px-3 py-1 rounded border border-emerald-500">
                {scannedResult}
              </p>
            </div>
          )}
        </div>

        {/* Manual Barcode Fallback Input */}
        <form
          onSubmit={handleManualSubmit}
          className="space-y-2 pt-2 border-t border-stone-200"
        >
          <label className="text-xs font-bold text-stone-700 block font-mono">
            Or Input / Paste Barcode Payload Manually:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. ART-2026-001 or CRATE-2026-04"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-300 rounded text-xs font-mono focus:ring-1 focus:ring-amber-800"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold rounded shadow-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
