import React, { useState } from "react";

const ASSIGNEE_AVATARS = {
  "Alex Rivera":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlhGt4lc9GbRYp0GB-PDXxnCpP1jJSEXVeo9F-It-t7MiW7q6k_qELAxD3GUGmHZvz3RyQkMQkqSIJnt1NHNQysDioVozsfU9A0wxqnciU2I2Mp9lBpxPASK-0eJLXwKjX2oH8XNMOXbYzu7qJVFAWfN5hNAoU0a0BayR_EzVb1uruoE4WUi4EwPYej65VTt5fEuibkHYCp_y5GUf9c_RxyzSm-tQ_hTIWMbuMvlS64WgQMIz7Kc45KvCLPigi0KrXeYIR4v24bgz0",
  "Sarah Chen":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAzBQ9iLb-U4j1vZQ1O47OqcUqJFZhqa7fck8JgnPW_v4CL3Zmj16kJF_ksvD1TCSMc8NX8_x0hMdoYwvqKHl0AGUWQ1_uIZGPjKSAiQpWUaxHfxImCP4k-3ncgNJMghDQDjoj9JXpH4vbCCIDYFF7oJNcdO0q7rpAOofPrwP62GuPr9uTXzv_Qvk3ZTWiEbvA1xqws0oeKJdJuCqjp_T_-HYGkN-NM0V3ZDUy4n7wEFECpoER6tCWR2p1Eww-ThJURRBucr4G4idp3",
  "John Doe":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCq1VVvqjgs5MXHvMHpjN_uQL-Kt3QSOVD9k20gbltgUiYoEtl8FKnBxH-sP_y2SniJd7Lh-FJCOvN7O4pFHaUPaFQ-ZoZoLMOL1dMp_e8LYQMiOWKUdYG7k5EdpBVAy8yIilB64LfXkzh3tYUGrk18WpajsR_mLj5f6RifVuIx8FtvJOA4jX3qEB2-XK9OVXteYA-PsdOPkGNl8ggwEMijEnLC4Ns5cngbaEgnEm77mV1Nv4fQp_BSvOZATEETY-XZ-VArTGKawSGG",
};

const TaskCard = ({ task, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleStatusSelect = (newStatus) => {
    onStatusChange(task.id, newStatus);
    setShowDropdown(false);
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 6000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return "recently";
    }
  };

  const avatarUrl = ASSIGNEE_AVATARS[task.assignee];

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-md flex flex-col gap-sm hover:border-primary/50 transition-colors group relative overflow-hidden">
      {task.status === "In Progress" && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
      )}

      <div
        className={`flex items-center justify-between ${task.status === "In Progress" ? "pl-2" : ""}`}
      >
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          #{task.id.substring(0, 8).toUpperCase()}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">
            schedule
          </span>
          {formatTimeAgo(task.created_at)}
        </span>
      </div>

      <h3
        className={`font-body-lg text-body-lg text-on-surface group-hover:text-primary transition-colors ${task.status === "In Progress" ? "pl-2" : ""} ${task.status === "Done" ? "line-through decoration-on-surface-variant/50 text-on-surface-variant" : ""}`}
      >
        {task.title}
      </h3>

      <div
        className={`mt-xs flex items-center justify-between ${task.status === "In Progress" ? "pl-2" : ""}`}
      >
        <div className="flex items-center gap-xs">
          {avatarUrl ? (
            <img
              className={`w-6 h-6 rounded-full object-cover ring-2 ring-surface-container ${task.status === "Done" ? "grayscale opacity-80" : ""}`}
              src={avatarUrl}
              alt={task.assignee}
              title={task.assignee}
            />
          ) : task.assignee ? (
            <div
              className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-sm text-[10px] font-bold"
              title={task.assignee}
            >
              {task.assignee.substring(0, 2).toUpperCase()}
            </div>
          ) : (
            <div
              className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant border-dashed flex items-center justify-center"
              title="Unassigned"
            >
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                person_off
              </span>
            </div>
          )}
          {task.assignee && (
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">
              {task.assignee}
            </span>
          )}
        </div>

        <div className="flex items-center gap-xs relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-surface-variant text-primary font-label-sm px-2 py-1 rounded flex items-center gap-1 hover:bg-surface-container-highest transition-colors"
          >
            {task.status}{" "}
            <span className="material-symbols-outlined text-[14px]">
              expand_more
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 bottom-full mb-1 bg-surface-container-highest border border-outline-variant rounded-lg shadow-xl z-30 py-1 min-w-[120px]">
              {["To Do", "In Progress", "Done"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`w-full text-left px-md py-sm font-label-sm text-label-sm hover:bg-surface-variant transition-colors ${task.status === status ? "text-primary font-bold" : "text-on-surface-variant"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
