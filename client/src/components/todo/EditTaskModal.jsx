import React, { useState, useEffect } from "react";

function formatUtcDate(dateString) {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  } catch {
    return dateString;
  }
}

export default function EditTaskModal({
  isOpen,
  task,
  onClose,
  onSave,
  isSaving = false,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCompleted(Boolean(task.completed));
      setValidationError("");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError("Task title cannot be empty");
      return;
    }

    setValidationError("");
    const success = await onSave(task.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      completed,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      data-node-id="2:201"
      data-name="Edit Todo Task Modal"
    >
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-6 p-6 sm:p-8 rounded-[14px] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        data-node-id="2:232"
        data-name="ModalDialog"
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between w-full"
          data-node-id="2:233"
          data-name="ModalHeader"
        >
          <h2
            className="font-bold text-[#171c29] text-[20px]"
            data-node-id="2:234"
          >
            Edit Todo Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#707a8c] hover:text-[#171c29] text-[18px] p-1"
            data-node-id="2:235"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full"
          data-node-id="2:236"
          data-name="ModalBody"
        >
          {/* Read-Only UUID */}
          <div
            className="flex flex-col gap-1 w-full"
            data-node-id="2:202"
            data-name="Field"
          >
            <label
              className="font-medium text-[#707a8c] text-[12px]"
              data-node-id="2:203"
            >
              Task Identifier (UUID v4 - Read Only)
            </label>
            <div
              className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] p-3 text-[13px] font-mono text-[#707a8c] select-all truncate"
              data-node-id="2:204"
            >
              <span data-node-id="2:205">{task.id}</span>
            </div>
          </div>

          {/* Title */}
          <div
            className="flex flex-col gap-1 w-full"
            data-node-id="2:206"
            data-name="Field"
          >
            <label
              htmlFor="edit-task-title"
              className="font-medium text-[#707a8c] text-[12px]"
              data-node-id="2:207"
            >
              Task Title *
            </label>
            <input
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError("");
              }}
              disabled={isSaving}
              className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] p-3 text-[14px] text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all w-full"
              data-node-id="2:208"
            />
            {validationError && (
              <p role="alert" className="text-xs text-red-500 font-medium mt-1">
                {validationError}
              </p>
            )}
          </div>

          {/* Description */}
          <div
            className="flex flex-col gap-1 w-full"
            data-node-id="2:210"
            data-name="Field"
          >
            <label
              htmlFor="edit-task-desc"
              className="font-medium text-[#707a8c] text-[12px]"
              data-node-id="2:211"
            >
              Description
            </label>
            <textarea
              id="edit-task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSaving}
              rows={3}
              className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] p-3 text-[14px] text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all resize-none w-full"
              data-node-id="2:212"
            />
          </div>

          {/* Completed Checkbox Toggle */}
          <div
            className="flex items-center gap-3 pt-1"
            data-node-id="2:214"
            data-name="CheckboxRow"
          >
            <input
              id="edit-task-completed"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={isSaving}
              className="size-5 rounded border-[#e3e8f0] text-[#2663eb] focus:ring-[#2663eb] cursor-pointer"
              data-node-id="2:215"
            />
            <label
              htmlFor="edit-task-completed"
              className="font-medium text-[#171c29] text-[14px] cursor-pointer"
              data-node-id="2:216"
            >
              Mark as Completed (Toggle Status)
            </label>
          </div>

          <div
            className="bg-[#e3e8f0] h-px my-1 w-full"
            data-node-id="2:217"
            data-name="Divider"
          />

          {/* Meta Summaries */}
          <div className="flex flex-col gap-2 text-[13px] text-[#707a8c]">
            <div
              className="flex items-center justify-between"
              data-node-id="2:218"
              data-name="SummaryRow"
            >
              <span>Created At (UTC)</span>
              <span className="font-medium text-[#171c29]">
                {formatUtcDate(task.created_at)}
              </span>
            </div>
            <div
              className="flex items-center justify-between"
              data-node-id="2:221"
              data-name="SummaryRow"
            >
              <span>Last Updated (UTC)</span>
              <span className="font-medium text-[#171c29]">
                {formatUtcDate(task.updated_at)}
              </span>
            </div>
            <div
              className="flex items-center justify-between text-xs"
              data-node-id="2:224"
              data-name="SummaryRow"
            >
              <span className="font-semibold text-[#171c29]">
                Backend Route Target
              </span>
              <span className="font-mono text-[#2663eb] truncate max-w-[280px]">
                PUT /api/v1/todos/{task.id}
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="flex gap-3 items-center justify-end pt-4 border-t border-[#e3e8f0]"
            data-node-id="2:237"
            data-name="ModalFooter"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="border border-[#e3e8f0] bg-white hover:bg-[#f2f5fa] text-[#171c29] font-medium text-[14px] px-4 py-2.5 rounded-[10px] transition-colors"
              data-node-id="2:227"
              data-name="Button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#2663eb] hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-[14px] px-5 py-2.5 rounded-[10px] flex items-center gap-2 transition-colors shadow-sm"
              data-node-id="2:229"
              data-name="Button"
            >
              <span>💾</span>
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
