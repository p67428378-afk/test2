import React, { useState, useEffect } from "react";
import {
  ScanEye,
  AlertTriangle,
  CheckCircle,
  Brain,
  Sparkles,
} from "lucide-react";
import PhotoMLInspector from "../components/ml/PhotoMLInspector";
import { getArtifacts } from "../services/api";

export default function MLClassificationPage() {
  const [artifacts, setArtifacts] = useState([]);
  const [classificationLogs, setClassificationLogs] = useState([
    {
      id: "ML-2026-901",
      artifact_code: "ART-2026-003",
      predicted_material: "Ceramic",
      confidence_score: 94.2,
      anomalies: ["Surface Micro-fracture detected on upper rim"],
      timestamp: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    async function loadArtifacts() {
      try {
        const data = await getArtifacts();
        if (data && data.length > 0) {
          setArtifacts(data);
        } else {
          setArtifacts([
            {
              id: "A1",
              artifact_code: "ART-2026-001",
              material: "Ceramic Amphora",
              depth_meters: 2.5,
            },
            {
              id: "A2",
              artifact_code: "ART-2026-002",
              material: "Bronze Dagger",
              depth_meters: 1.4,
            },
            {
              id: "A3",
              artifact_code: "ART-2026-003",
              material: "Ceramic Jar",
              depth_meters: 3.1,
            },
          ]);
        }
      } catch (e) {
        setArtifacts([
          {
            id: "A1",
            artifact_code: "ART-2026-001",
            material: "Ceramic Amphora",
            depth_meters: 2.5,
          },
          {
            id: "A2",
            artifact_code: "ART-2026-002",
            material: "Bronze Dagger",
            depth_meters: 1.4,
          },
          {
            id: "A3",
            artifact_code: "ART-2026-003",
            material: "Ceramic Jar",
            depth_meters: 3.1,
          },
        ]);
      }
    }
    loadArtifacts();
  }, []);

  const handleClassificationComplete = (data) => {
    const artObj = artifacts.find((a) => a.id === data.artifact_id);
    const newLog = {
      id: data.id || `ML-${Date.now()}`,
      artifact_code: artObj?.artifact_code || "ART-2026-001",
      predicted_material: data.predicted_material,
      confidence_score: data.confidence_score,
      anomalies:
        data.anomalies_detected?.map((a) => `${a.type}: ${a.description}`) ||
        [],
      timestamp: new Date().toISOString(),
    };
    setClassificationLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-stone-900 flex items-center space-x-2">
            <ScanEye className="w-6 h-6 text-amber-900" />
            <span>
              Automated Photo Artifact Material Classification & Anomaly
              Inspector
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            PyTorch computer vision pipeline analyzing material composition &
            surface defects
          </p>
        </div>
      </div>

      {/* Main ML Inspector Component */}
      <PhotoMLInspector
        artifacts={artifacts}
        onClassificationComplete={handleClassificationComplete}
      />

      {/* Classification History Log Table */}
      <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-md font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-200 pb-2">
          <Brain className="w-4 h-4 text-amber-800" />
          <span>Computer Vision Classification History Log</span>
        </h3>

        <div className="overflow-x-auto border border-stone-200 rounded-lg">
          <table className="w-full text-xs font-mono text-left text-stone-700">
            <thead className="bg-stone-100 uppercase text-stone-500 font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Artifact</th>
                <th className="p-3">Predicted Material</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Anomalies Detected</th>
                <th className="p-3">Analysis Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {classificationLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-amber-900">{log.id}</td>
                  <td className="p-3 font-bold">{log.artifact_code}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">
                      {log.predicted_material}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-800">
                    {log.confidence_score.toFixed(1)}%
                  </td>
                  <td className="p-3">
                    {log.anomalies?.length > 0 ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded flex items-center space-x-1 w-fit">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>{log.anomalies.join(", ")}</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">None</span>
                    )}
                  </td>
                  <td className="p-3 text-stone-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
