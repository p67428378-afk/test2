import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/tasks/TaskForm.jsx";
import { createTask } from "../services/api.js";

const TaskCreationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateTask = async (taskData) => {
    setIsLoading(true);
    try {
      await createTask(taskData.title, taskData.assignee);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-lg h-full">
      <div className="mb-md">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">
          Create Task
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add a new task to the real-time worklist
        </p>
      </div>

      <div className="flex-1">
        <TaskForm onSubmit={handleCreateTask} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default TaskCreationPage;
