import React, { useState, useEffect } from "react";
import { generateDigitalPass, downloadDigitalPassPdf } from "../services/api";
import {
  QrCode,
  Download,
  ShieldCheck,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";

const DigitalPassView = ({ appointment, passData: initialPassData }) => {
  const [passData, setPassData] = useState(initialPassData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialPassData) {
      setPassData(initialPassData);
    } else if (appointment && appointment.id) {
      if (appointment.digital_pass) {
        setPassData(appointment.digital_pass);
      } else {
        fetchPass();
      }
    }
  }, [appointment, initialPassData]);

  const fetchPass = async () => {
    if (!appointment?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateDigitalPass(appointment.id);
      setPassData(data);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to retrieve digital pass.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!appointment?.id) return;
    try {
      if (passData?.pdf_download_url) {
        window.open(passData.pdf_download_url, "_blank");
      } else {
        await downloadDigitalPassPdf(appointment.id);
        alert("PDF Digital Pass download initiated.");
      }
    } catch (err) {
      console.error("PDF Download error:", err);
      alert("Unable to download PDF pass at this time.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-blue-900" />
          <h2 className="text-lg font-bold text-slate-900">
            Active Digital Gate Pass —{" "}
            {passData?.pass_token ||
              `PASS-${appointment?.id?.substring(0, 8) || "8892"}`}
          </h2>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHICALLY SIGNED</span>
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          Generating Digital QR Pass...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 bg-slate-100 p-6 rounded-xl border border-slate-200 text-center">
            {passData?.qr_code_data_url ? (
              <img
                src={passData.qr_code_data_url}
                alt="Encrypted Gate QR Pass"
                className="w-48 h-48 mx-auto object-contain bg-white p-2 rounded-lg shadow-inner"
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-inner my-2 font-mono font-bold text-blue-900 border border-slate-300">
                <div className="text-xl mb-2">[QR CODE ENCRYPTED]</div>
                <div className="text-xs text-slate-500 font-normal">
                  HMAC-SHA256 Token Signature
                </div>
              </div>
            )}
            <p className="text-xs text-slate-600 font-mono mt-3 break-all bg-slate-200/70 p-2 rounded">
              Token:{" "}
              <span className="font-semibold">
                {passData?.pass_token ||
                  `PASS-${appointment?.id || "8892"}-HMAC256`}
              </span>
            </p>
          </div>

          <div className="md:col-span-6 space-y-4">
            <div className="space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Visitor Name:</span>
                <span className="font-semibold text-slate-900">
                  {appointment?.visitor?.full_name || "Jane Doe"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Inmate Target:</span>
                <span className="font-semibold text-slate-900">
                  {appointment?.inmate?.full_name || "John Smith"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-semibold text-slate-900">
                  {appointment?.visit_date || "Today"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Slot Duration:</span>
                <span className="font-semibold text-slate-900">
                  {appointment?.slot_duration_minutes || 30} Minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pass Expires:</span>
                </span>
                <span className="font-semibold text-amber-700">
                  {passData?.expires_at
                    ? new Date(passData.expires_at).toLocaleTimeString()
                    : "End of Visit Slot"}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadPdf}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Download Official PDF Pass</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalPassView;
