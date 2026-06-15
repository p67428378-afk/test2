import React, { useState } from 'react';

export default function TaskRow({ task, onToggleComplete, onUpdateDescription, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.description);

  const handleSave = () => {
    if (editValue.trim() && editValue !== task.description) {
      onUpdateDescription(task.id, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(task.description);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b border-white/5 hover:bg-surface-container-highest transition-colors group ${task.completed ? 'opacity-60' : ''}`}>
      <div className='flex items-center gap-4 flex-1 min-w-0'>
        <input
          type='checkbox'
          checked={task.completed}
          onChange={() => onToggleComplete(task.id, !task.completed)}
          className='w-5 h-5 rounded border-outline-variant text-primary bg-transparent focus:ring-primary focus:ring-offset-[#1E293B] cursor-pointer'
        />
        <div className='flex-1 min-w-0'>
          {isEditing ? (
            <input
              type='text'
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              className='w-full bg-transparent border-b border-primary text-on-surface focus:ring-0 p-0 font-body-md text-body-md outline-none'
            />
          ) : (
            <span className={`font-body-md text-body-md block truncate ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
              {task.description}
            </span>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0 ml-4'>
        {!task.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-white/5'
            title='Edit task'
          >
            <span className='material-symbols-outlined text-[20px]'>edit</span>
          </button>
        )}
        <button
          onClick={handleDelete}
          className='p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg hover:bg-error/10'
          title='Delete task'
        >
          <span className='material-symbols-outlined text-[20px]'>delete</span>
        </button>
      </div>
    </div>
  );
}
