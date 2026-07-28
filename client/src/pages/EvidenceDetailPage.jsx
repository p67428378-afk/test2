import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Fingerprint,
  FileText,
  Image,
  Video,
  Cpu,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { evidenceService, auditService } from "../services/api";
import ChainOfCustodyTimeline from "../components/evidence/ChainOfCustodyTimeline.jsx";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";

export default function EvidenceDetailPage({ cases, fetchData }) {
  const { id } = useParams();
  const [evidence, setEvidence] = useState(null);
  const [chainOfCustody, setChainOfCustody] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const loadEvidenceDetails = async () => {
    try {
      setLoading(true);
      const data = await evidenceService.getEvidence(id);
      setEvidence(data);

      const coc = await auditService.getChainOfCustody(id);
      setChainOfCustody(coc);
      setError(null);
    } catch (err) {
      console.error("Error loading evidence details", err);
      setError(
        "Failed to load evidence details. It might not exist or you might be unauthorized.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvidenceDetails();
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await evidenceService.analyzeEvidence(id);
      await loadEvidenceDetails();
      await fetchData();
    } catch (err) {
      console.error("Error analyzing evidence", err);
      alert(err.response?.data?.detail || "Failed to run analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("image"))
      return <Image className="h-8 w-8 text-[#4edea3]" />;
    if (lowerType.includes("video"))
      return <Video className="h-8 w-8 text-[#ffb95f]" />;
    return <FileText className="h-8 w-8 text-[#c0c1ff]" />;
  };

  const getCaseNumber = (caseId) => {
    if (!caseId) return null;
    const foundCase = cases.find((c) => c.id === caseId);
    return foundCase ? foundCase.case_number : "Assigned";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0c1ff]"></div>
      </div>
    );
  }

  if (error || !evidence) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#c0c1ff] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span>{error || "Evidence not found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#c0c1ff] hover:underline text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#c0c1ff]/10 rounded-lg">
              {getFileIcon(evidence.file_type)}
            </div>
            <div>
              <h2
                className="text-2xl font-bold text-[#dae2fd] truncate max-w-xl"
                title={evidence.filename}
              >
                {evidence.filename}
              </h2>
              <p className="text-sm text-[#c7c4d7] mt-1">
                Evidence Metadata & Chain of Custody
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            <Cpu className="h-4 w-4" />{" "}
            {analyzing ? "Analyzing..." : "Run Analysis"}
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-level-1 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#c0c1ff]">Metadata</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[#c7c4d7] font-medium">File Type</p>
                <p className="text-[#dae2fd] mt-0.5">{evidence.file_type}</p>
              </div>
              <div>
                <p className="text-[#c7c4d7] font-medium">File Size</p>
                <p className="text-[#dae2fd] mt-0.5">
                  {formatBytes(evidence.file_size)}
                </p>
              </div>
              <div>
                <p className="text-[#c7c4d7] font-medium">SHA-256 Hash</p>
                <p className="text-[#dae2fd] font-mono text-xs mt-0.5 break-all bg-[#0F172A] p-2 rounded border border-[#334155]">
                  {evidence.sha256_hash}
                </p>
              </div>
              <div>
                <p className="text-[#c7c4d7] font-medium">Storage Path</p>
                <p className="text-[#dae2fd] font-mono text-xs mt-0.5 break-all bg-[#0F172A] p-2 rounded border border-[#334155]">
                  {evidence.storage_path}
                </p>
              </div>
              <div>
                <p className="text-[#c7c4d7] font-medium">Case Assignment</p>
                <div className="mt-1">
                  {evidence.case_id ? (
                    <Link to={`/cases/${evidence.case_id}`}>
                      <Badge variant="success">
                        {getCaseNumber(evidence.case_id)}
                      </Badge>
                    </Link>
                  ) : (
                    <Badge variant="warning">Unassigned</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[#c7c4d7] font-medium">Uploaded At</p>
                <p className="text-[#dae2fd] mt-0.5">
                  {new Date(evidence.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chain of Custody Timeline */}
        <div className="lg:col-span-2">
          <div className="card-level-1 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-[#334155] pb-4">
              <h3 className="text-lg font-semibold text-[#dae2fd]">
                Chain of Custody Log
              </h3>
              <Badge variant="info">Immutable Trail</Badge>
            </div>
            <ChainOfCustodyTimeline logs={chainOfCustody} />
          </div>
        </div>
      </div>
    </div>
  );
}
