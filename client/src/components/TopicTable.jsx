import React from "react";
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";

const TopicTable = ({
  topics = [],
  onStatusChange,
  onEdit,
  onDelete,
  onAddTopic,
}) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "In Progress":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h4 className="font-semibold text-slate-800 text-base">Topics</h4>
        {onAddTopic && (
          <button
            onClick={onAddTopic}
            className="flex items-center space-x-1 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Topic</span>
          </button>
        )}
      </div>

      {topics.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No topics added yet for this subject. Click "Add Topic" to get
          started!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Topic Title</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Est. Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((topic) => (
                <tr
                  key={topic.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {topic.title}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border ${getDifficultyBadge(
                        topic.difficulty,
                      )}`}
                    >
                      {topic.difficulty || "Medium"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex items-center space-x-1 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{topic.estimated_minutes || 60} mins</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(topic.status)}
                      <select
                        value={topic.status || "Not Started"}
                        onChange={(e) =>
                          onStatusChange &&
                          onStatusChange(topic.id, e.target.value)
                        }
                        className="text-xs bg-transparent font-medium border-0 focus:ring-0 cursor-pointer text-slate-700 py-1"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(topic)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                        title="Edit Topic"
                        aria-label="Edit Topic"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(topic.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Delete Topic"
                        aria-label="Delete Topic"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopicTable;
