import React, { useState } from "react";

const TaskForm = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        assignee: assignee.trim() || null,
      });
      setTitle("");
      setAssignee("");
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Failed to create task.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-xl p-lg border border-outline-variant/50 flex flex-col gap-md max-w-xl"
    >
      <h2 className="font-title-md text-title-md text-on-surface mb-xs">
        Create New Task
      </h2>

      {error && (
        <div
          className="bg-error/10 border border-error/20 text-error p-md rounded-lg font-body-sm text-body-sm flex items-center gap-sm"
          role="alert"
        >
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="title"
          className="font-label-md text-label-md text-on-surface-variant"
        >
          Task Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Implement OAuth2 Authentication"
          className="bg-surface-container-highest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label
          htmlFor="assignee"
          className="font-label-md text-label-md text-on-surface-variant"
        >
          Assignee (Optional)
        </label>
        <select
          id="assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="bg-surface-container-highest border border-outline-variant rounded-lg py-sm px-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          disabled={isLoading}
        >
          <option value="">Unassigned</option>
          <option value="Alex Rivera">Alex Rivera (Team Lead)</option>
          <option value="Sarah Chen">Sarah Chen (Software Engineer)</option>
          <option value="John Doe">John Doe (Developer)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-on-primary hover:bg-primary-fixed border border-transparent hover:border-primary-fixed-dim transition-all py-sm px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-xs shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-sm"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            Creating...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Task
          </>
        )}
      </button>
    </form>
  );
};

export default TaskForm;
