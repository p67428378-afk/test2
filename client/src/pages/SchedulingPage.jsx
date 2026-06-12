import React, { useEffect, useState } from 'react';
import WeeklyCalendar from '../components/scheduling/WeeklyCalendar.jsx';
import ToDoList from '../components/scheduling/ToDoList.jsx';
import { getTasks, createTask, updateTask } from '../services/api.js';

export default function SchedulingPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasksData = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      // Mock user_id for task creation (since we don't have auth fully wired in frontend)
      const mockUserId = '00000000-0000-0000-0000-000000000000';
      await createTask({ ...taskData, user_id: mockUserId });
      await fetchTasksData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await fetchTasksData();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return <div className='text-center py-12 text-on-surface-variant'>Loading schedule...</div>;
  }

  return (
    <div className='space-y-gutter'>
      <div>
        <h3 className='font-headline-sm text-headline-sm text-primary font-bold'>Farming Schedule & Tasks</h3>
        <p className='font-label-sm text-on-surface-variant mt-1'>
          Manage planting, harvesting, watering, and other daily farming activities.
        </p>
      </div>

      <WeeklyCalendar tasks={tasks} onUpdateTaskStatus={handleUpdateTaskStatus} />

      <ToDoList
        tasks={tasks}
        onCreateTask={handleCreateTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
      />
    </div>
  );
}