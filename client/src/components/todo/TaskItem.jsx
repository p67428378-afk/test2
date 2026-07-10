import React, { useState } from "react";
import {
  Check,
  Edit2,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function TaskItem({
  task,
  onToggleComplete,
  onSaveEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (!editText.trim()) return;
    onSaveEdit(editText.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-card border border-[#6366F1] rounded-xl p-4 flex items-center gap-4 bg-[#2A374A] shadow-[0_0_0_1px_rgba(99,102,241,0.5)]">
        <div className="flex flex-col gap-1">
          <button disabled className="text-[#464554] opacity-30">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button disabled className="text-[#464554] opacity-30">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        <button
          className="w-6 h-6 rounded border-2 border-[#464554] flex items-center justify-center"
          disabled
        ></button>
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 bg-[#0b1326] border border-[#6366F1] rounded px-3 py-1 text-base text-[#dae2fd] outline-none"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
            title="Save"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#171f33] rounded transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-card border border-[#464554] rounded-xl p-4 flex items-center gap-4 group hover:bg-[#2A374A] transition-colors bg-[#171f33] ${
        task.is_completed ? "opacity-75" : ""
      }`}
    >
      {/* Reordering Controls */}
      <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className={`text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors ${
            !canMoveUp ? "opacity-20 cursor-not-allowed" : ""
          }`}
          title="Move Up"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className={`text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors ${
            !canMoveDown ? "opacity-20 cursor-not-allowed" : ""
          }`}
          title="Move Down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Checkbox */}
      <button
        onClick={onToggleComplete}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
          task.is_completed
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-[#464554] hover:border-[#c0c1ff]"
        }`}
      >
        {task.is_completed && <Check className="w-4 h-4 font-bold" />}
      </button>

      {/* Task Text */}
      <span
        className={`text-base flex-1 ${
          task.is_completed ? "text-[#64748B] line-through" : "text-[#F8FAFC]"
        }`}
      >
        {task.text}
      </span>

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-[#c7c4d7] hover:text-[#dae2fd] rounded hover:bg-[#171f33] transition-colors"
          title="Edit"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-[#c7c4d7] hover:text-[#F43F5E] rounded hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
