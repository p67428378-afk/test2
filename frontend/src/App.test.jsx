import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import taskService from './services/taskService';

describe('App', () => {
  it('renders the main application and fetches tasks', async () => {
    const mockTasks = [
      { id: 1, description: 'Test Task 1', due_date: '2024-12-31', priority: 'High', is_complete: false },
      { id: 2, description: 'Test Task 2', due_date: '2024-12-31', priority: 'Medium', is_complete: true },
    ];
    vi.spyOn(taskService, 'getAll').mockResolvedValue(mockTasks);

    render(<App />);

    expect(await screen.findByText('My Todo List')).toBeInTheDocument();
    expect(await screen.findByText('Test Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Task 2')).toBeInTheDocument();
  });

  it('adds a new task', async () => {
    const mockTask = { id: 3, description: 'New Task', due_date: '2025-01-01', priority: 'Low', is_complete: false };
    vi.spyOn(taskService, 'getAll').mockResolvedValue([]);
    vi.spyOn(taskService, 'create').mockResolvedValue(mockTask);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Add Task'));

    expect(await screen.findByText('New Task')).toBeInTheDocument();
  });
});
