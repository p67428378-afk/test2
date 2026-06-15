import React, { useState, useEffect } from 'react';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

export default function DashboardPage({ currentFilter, onFilterChange, searchQuery }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasksList = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksList();
  }, []);

  const handleAddTask = async (description) => {
    try {
      const newTask = await createTask(description);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task.');
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updated = await updateTask(taskId, { completed });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status.');
    }
  };

  const handleUpdateDescription = async (taskId, description) => {
    try {
      const updated = await updateTask(taskId, { description });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error('Error updating task description:', err);
      alert('Failed to update task description.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  // Filter tasks by search query
  const searchedTasks = tasks.filter((task) =>
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='font-display-lg text-display-lg text-on-surface mb-2'>Good morning, Alex.</h1>
        <p className='font-body-lg text-body-lg text-on-surface-variant'>Here's an overview of your productivity today.</p>
      </div>

      {/* Stat Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-level-1 p-6 rounded-2xl flex flex-col gap-4'>
          <span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Total Tasks</span>
          <span className='font-display-lg text-display-lg text-on-surface'>{totalTasks}</span>
          <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden mt-auto'>
            <div className='h-full bg-primary w-full'></div>
          </div>
        </div>
        <div className='bg-level-1 p-6 rounded-2xl flex flex-col gap-4'>
          <div className='flex justify-between items-start'>
            <span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Completed</span>
            <span className='px-2 py-1 bg-secondary/20 text-secondary rounded-full font-label-sm text-label-sm'>{completionPercentage}%</span>
          </div>
          <span className='font-display-lg text-display-lg text-on-surface'>{completedTasks}</span>
          <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden mt-auto'>
            <div style={{ width: `${completionPercentage}%` }} className='h-full bg-secondary transition-all duration-300'></div>
          </div>
        </div>
        <div className='bg-level-1 p-6 rounded-2xl flex flex-col gap-4'>
          <div className='flex justify-between items-start'>
            <span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Pending</span>
            <span className='px-2 py-1 bg-tertiary-container text-tertiary rounded-full font-label-sm text-label-sm'>Action Needed</span>
          </div>
          <span className='font-display-lg text-display-lg text-on-surface'>{pendingTasks}</span>
          <div className='w-full h-1 bg-white/10 rounded-full overflow-hidden mt-auto'>
            <div style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }} className='h-full bg-tertiary transition-all duration-300'></div>
          </div>
        </div>
      </div>

      {/* Task Form */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Error Message */}
      {error && (
        <div className='p-4 bg-error/10 border border-error/20 text-error rounded-xl font-body-md'>
          {error}
        </div>
      )}

      {/* Task Area */}
      {loading ? (
        <div className='text-center py-12 text-on-surface-variant'>
          Loading tasks...
        </div>
      ) : (
        <TaskList
          tasks={searchedTasks}
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          onToggleComplete={handleToggleComplete}
          onUpdateDescription={handleUpdateDescription}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}
