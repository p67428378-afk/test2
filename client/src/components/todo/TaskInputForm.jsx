import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function TaskInputForm({ onAddTask }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="task-card border border-[#464554] rounded-xl p-4 mb-8 flex gap-2 items-center shadow-sm bg-[#171f33]"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-transparent border-none focus:ring-0 text-base text-[#dae2fd] placeholder-[#c7c4d7]/50 h-12 px-4 rounded-lg outline-none"
        placeholder="Add a new task to your list... (e.g., Buy milk)"
      />
      <button
        type="submit"
        className="bg-[#6366F1] hover:bg-opacity-90 text-white font-semibold text-sm h-12 px-6 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-md"
      >
        <Plus className="w-5 h-5" />
        Add Task
      </button>
    </form>
  );
}
