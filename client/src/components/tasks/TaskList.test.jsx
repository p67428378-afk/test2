import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from './TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    { id: '1', description: 'Task One', completed: false },
    { id: '2', description: 'Task Two', completed: true },
  ];

  it('renders without crashing and displays tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        currentFilter='all'
        onFilterChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onUpdateDescription={vi.fn()}
        onDeleteTask={vi.fn()}
      />
    );

    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  it('shows empty state message when there are no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        currentFilter='all'
        onFilterChange={vi.fn()}
        onToggleComplete={vi.fn()}
        onUpdateDescription={vi.fn()}
        onDeleteTask={vi.fn()}
      />
    );

    expect(screen.getByText('No tasks found.')).toBeInTheDocument();
  });
});
