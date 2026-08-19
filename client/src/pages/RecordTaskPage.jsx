import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { createTask } from "../services/api";
import { ArrowLeft } from "lucide-react";

export default function RecordTaskPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleFormSubmit = async (payload) => {
    setSubmitting(true);
    setServerError("");
    try {
      await createTask(payload);
      navigate("/");
    } catch (err) {
      console.error("Failed to create task:", err);
      setServerError(
        err.response?.data?.detail ||
          err.message ||
          "Error recording maintenance task.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 text-[#707a8c] hover:text-[#171c29] rounded-lg hover:bg-gray-100 transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Record Maintenance Task
        </h1>
      </div>

      {serverError && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
        >
          {serverError}
        </div>
      )}

      <TaskForm onSubmit={handleFormSubmit} submitting={submitting} />
    </div>
  );
}
