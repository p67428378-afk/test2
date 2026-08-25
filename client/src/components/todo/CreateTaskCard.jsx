import React, { useState } from "react";

export default function CreateTaskCard({ onCreateTask, isSubmitting = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError("Task title is required");
      return;
    }

    setValidationError("");
    const success = await onCreateTask({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    if (success) {
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-3 p-6 rounded-[14px] shadow-sm shrink-0 w-full"
        data-node-id="2:57"
        data-name="CreateTaskCard"
      >
        <h2
          className="font-bold text-[#171c29] text-[18px]"
          data-node-id="2:58"
        >
          Add New Task
        </h2>
        <p
          className="font-normal text-[#707a8c] text-[13px]"
          data-node-id="2:40"
        >
          Create and organize your daily priorities seamlessly.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          {/* Task Title */}
          <div
            className="flex flex-col gap-1 w-full"
            data-node-id="2:41"
            data-name="Field"
          >
            <label
              htmlFor="task-title-input"
              className="font-medium text-[#707a8c] text-[12px]"
              data-node-id="2:42"
            >
              Task Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError("");
              }}
              placeholder="e.g., Buy groceries & meal prep"
              disabled={isSubmitting}
              className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] p-3 text-[14px] text-[#171c29] placeholder-[#707a8c] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all w-full"
              data-node-id="2:43"
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
            data-node-id="2:45"
            data-name="Field"
          >
            <label
              htmlFor="task-desc-input"
              className="font-medium text-[#707a8c] text-[12px]"
              data-node-id="2:46"
            >
              Description (Optional)
            </label>
            <textarea
              id="task-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Milk, organic eggs, sourdough bread"
              disabled={isSubmitting}
              rows={3}
              className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] p-3 text-[14px] text-[#171c29] placeholder-[#707a8c] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all resize-none w-full"
              data-node-id="2:47"
            />
          </div>

          {/* Priority Level */}
          <div
            className="flex flex-col gap-1 w-full"
            data-node-id="2:49"
            data-name="Dropdown"
          >
            <label
              htmlFor="task-priority-select"
              className="font-medium text-[#707a8c] text-[12px]"
              data-node-id="2:50"
            >
              Priority Level
            </label>
            <select
              id="task-priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
              className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] p-3 text-[14px] text-[#171c29] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all w-full"
              data-node-id="2:51"
            >
              <option value="High">🔥 High Priority</option>
              <option value="Medium">⚡ Medium Priority</option>
              <option value="Low">🌱 Low Priority</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-[#2663eb] hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-[14px] py-3 px-4 rounded-[10px] flex items-center justify-center gap-2 transition-colors w-full shadow-sm"
            data-node-id="2:54"
            data-name="Button"
          >
            <span className="text-lg leading-none" data-node-id="2:55">
              ＋
            </span>
            <span data-node-id="2:56">
              {isSubmitting ? "Adding Task..." : "Add Todo Task"}
            </span>
          </button>
        </form>
      </div>

      {/* Quick Tips Card */}
      <div
        className="bg-white border border-[#e3e8f0] flex flex-col gap-3 p-6 rounded-[14px] shadow-sm shrink-0 w-full"
        data-node-id="2:62"
        data-name="TipsCard"
      >
        <h3
          className="font-bold text-[#171c29] text-[18px]"
          data-node-id="2:63"
        >
          Quick Tips & Shortcuts
        </h3>
        <ul className="flex flex-col gap-2 text-[#707a8c] text-[13px]">
          <li className="flex items-start gap-2" data-node-id="2:59">
            <span>•</span>
            <span>Check the box to mark a task completed.</span>
          </li>
          <li className="flex items-start gap-2" data-node-id="2:60">
            <span>•</span>
            <span>Click ✏️ to edit title or description.</span>
          </li>
          <li className="flex items-start gap-2" data-node-id="2:61">
            <span>•</span>
            <span>Click 🗑️ to permanently remove a task.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
