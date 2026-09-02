import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, Box, RefreshCw } from "lucide-react";

export default function BatchQRGenerator({ artifacts = [], containers = [] }) {
  const [selectedType, setSelectedType] = useState("artifact");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const list = selectedType === "artifact" ? artifacts : containers;
    if (list.length > 0) {
      setSelectedEntityId(
        list[0].id || list[0].artifact_code || list[0].container_code,
      );
    } else {
      setSelectedEntityId("");
    }
  }, [selectedType, artifacts, containers]);

  useEffect(() => {
    if (!selectedEntityId) {
      setQrDataUrl("");
      return;
    }

    setGenerating(true);
    const payload = JSON.stringify({
      type: selectedType,
      id: selectedEntityId,
      timestamp: new Date().toISOString(),
      system: "ArchExcav-v2",
    });

    QRCode.toDataURL(payload, {
      width: 220,
      margin: 2,
      color: { dark: "#1c1917", light: "#ffffff" },
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      })
      .finally(() => {
        setGenerating(false);
      });
  }, [selectedType, selectedEntityId]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Print QR Barcode Tag - ${selectedEntityId}</title></head>
          <body style="text-align:center; font-family:sans-serif; padding:20px;">
            <h2>ArchExcav Physical Tag</h2>
            <p><strong>Code:</strong> ${selectedEntityId}</p>
            <img src="${qrDataUrl}" style="width:200px; height:200px;" />
            <p style="font-size:12px; color:#666;">ISO/IEC 18004 Compliant Security Tag</p>
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-stone-200 pb-3">
        <h3 className="text-md font-bold text-stone-900 flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-amber-900" />
          <span>Batch ISO/IEC 18004 QR Code & Barcode Generator</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Select Entity Category
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedType("artifact")}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-bold ${
                  selectedType === "artifact"
                    ? "bg-amber-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Artifact Tags
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("container")}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-bold ${
                  selectedType === "container"
                    ? "bg-amber-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                Storage Crates/Bins
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Select Target Item
            </label>
            <select
              value={selectedEntityId}
              onChange={(e) => setSelectedEntityId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded text-xs font-mono"
            >
              {selectedType === "artifact" ? (
                artifacts.length === 0 ? (
                  <option value="">No artifacts available</option>
                ) : (
                  artifacts.map((a) => (
                    <option key={a.id} value={a.artifact_code || a.id}>
                      {a.artifact_code} ({a.material})
                    </option>
                  ))
                )
              ) : containers.length === 0 ? (
                <option value="">No storage containers available</option>
              ) : (
                containers.map((c) => (
                  <option key={c.id} value={c.container_code || c.id}>
                    {c.container_code} ({c.room_name} / Bin-{c.bin_number})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* QR Preview Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
          {generating ? (
            <RefreshCw className="w-8 h-8 text-amber-800 animate-spin" />
          ) : qrDataUrl ? (
            <>
              <img
                src={qrDataUrl}
                alt="Generated QR Tag"
                className="w-40 h-40 border border-stone-300 rounded bg-white p-2 shadow-sm"
              />
              <p className="text-xs font-mono font-bold text-stone-800">
                {selectedEntityId}
              </p>
              <div className="flex space-x-2">
                <a
                  href={qrDataUrl}
                  download={`QR-${selectedEntityId}.png`}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold rounded flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tag</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-stone-500 italic">
              Select an item to preview QR code
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
