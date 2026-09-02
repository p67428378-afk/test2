import React from "react";
import { Trash2, Layers, Calendar, User, Tag } from "lucide-react";

export default function ArtifactTable({
  artifacts = [],
  loading,
  onDeleteArtifact,
  onSelectArtifact,
}) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        Loading cataloged artifacts...
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg border border-stone-200 text-center text-stone-500">
        No artifacts found matching criteria.
      </div>
    );
  }

  const getMaterialBadgeColor = (material) => {
    switch (material?.toLowerCase()) {
      case "ceramic":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "bronze":
      case "iron":
      case "gold":
        return "bg-yellow-100 text-yellow-900 border-yellow-200";
      case "lithic":
      case "stone":
        return "bg-stone-200 text-stone-800 border-stone-300";
      case "bone":
      case "organic":
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
      case "glass":
        return "bg-blue-100 text-blue-900 border-blue-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Artifact Code / Material
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Context & Depth
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Excavation Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Discoverer
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white text-sm">
            {artifacts.map((artifact) => (
              <tr
                key={artifact.id}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-bold text-stone-900 font-mono text-sm">
                    {artifact.artifact_code}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getMaterialBadgeColor(artifact.material)}`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {artifact.material}
                    </span>
                  </div>
                  {artifact.description && (
                    <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                      {artifact.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1 text-stone-800 text-xs font-medium">
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    <span>{artifact.context_layer}</span>
                  </div>
                  <div className="text-xs font-mono text-stone-600 mt-0.5">
                    Depth:{" "}
                    <span className="font-bold text-amber-900">
                      {artifact.depth_meters} m
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-700 text-xs font-mono">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{artifact.excavation_date}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-700 text-xs">
                  {artifact.finder ? (
                    <div className="flex items-center space-x-1 font-medium text-stone-900">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span>{artifact.finder.full_name}</span>
                    </div>
                  ) : (
                    <span className="text-stone-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {onSelectArtifact && (
                    <button
                      onClick={() => onSelectArtifact(artifact)}
                      className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded text-xs font-medium hover:bg-amber-100 transition"
                    >
                      Details
                    </button>
                  )}
                  {onDeleteArtifact && (
                    <button
                      onClick={() => onDeleteArtifact(artifact.id)}
                      title="Delete Artifact"
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
