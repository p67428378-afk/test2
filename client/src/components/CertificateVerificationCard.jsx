import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Download,
  AlertCircle,
  QrCode,
  ExternalLink,
  Search,
  CheckCircle2,
} from "lucide-react";
import { certificateService } from "../services/api";

export default function CertificateVerificationCard({ initialUuid = "" }) {
  const [uuidInput, setUuidInput] = useState(initialUuid);
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = async (uuidToVerify) => {
    const targetUuid = (uuidToVerify || uuidInput).trim();
    if (!targetUuid) {
      setErrorMsg("Please enter a valid certificate UUID.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setCertData(null);

    try {
      const data = await certificateService.verifyCertificate(targetUuid);
      setCertData(data);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        "Certificate invalid or authentic record not found";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUuid) {
      setUuidInput(initialUuid);
      handleVerify(initialUuid);
    }
  }, [initialUuid]);

  const pdfUrl = certData?.verification_uuid
    ? certificateService.getCertificatePdfUrl(certData.verification_uuid)
    : null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl text-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-700 mb-6">
        <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/30">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Digital Certificate Portal
          </h2>
          <p className="text-xs text-slate-400">
            Cryptographically verifiable FIDE tournament achievements & QR
            validation
          </p>
        </div>
      </div>

      {/* Verification Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="flex gap-2 mb-6"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={uuidInput}
            onChange={(e) => setUuidInput(e.target.value)}
            placeholder="Enter Certificate UUID (e.g. 550e8400-e29b-41d4-a716-446655440000)"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow transition-colors shrink-0 flex items-center space-x-2"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      {/* Error Banner */}
      {errorMsg && (
        <div
          role="alert"
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400 text-sm mb-6"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Verification Failed</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Certificate Verified View */}
      {certData && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-6 shadow-inner relative overflow-hidden">
          {/* Background Badge */}
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTIC RECORD</span>
          </div>

          <div className="text-center pt-2 pb-6 border-b border-slate-800">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">
              Official Digital Certificate
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {certData.player_name}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              {certData.tournament_name}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 text-center border-b border-slate-800">
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Final Rank
              </span>
              <span className="text-xl font-black text-amber-400">
                #{certData.rank}
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Total Score
              </span>
              <span className="text-xl font-black text-emerald-400">
                {Number(certData.total_points || 0).toFixed(1)} Pts
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Issued Date
              </span>
              <span className="text-xs font-bold text-slate-200 mt-1 block">
                {new Date(certData.issued_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* QR Code & Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 bg-slate-800 p-2.5 rounded-lg border border-slate-700">
              <div className="p-2 bg-white rounded shadow shrink-0">
                {certData.qr_code_url ? (
                  <img
                    src={certData.qr_code_url}
                    alt="Certificate QR Code"
                    className="w-12 h-12"
                  />
                ) : (
                  <QrCode className="w-12 h-12 text-slate-900" />
                )}
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  UUID Verification Code
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-200 block truncate max-w-[200px]">
                  {certData.verification_uuid}
                </span>
              </div>
            </div>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg transition-colors flex items-center justify-center space-x-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
