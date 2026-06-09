import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IssuesList from './IssuesList';

describe('IssuesList Component', () => {
  const mockIssues = [
    {
      issue_id: '1',
      severity: 'CRITICAL',
      line_number: 10,
      message: 'Hardcoded password found',
      file_path: 'server/main.py',
    },
    {
      issue_id: '2',
      severity: 'WARNING',
      line_number: 15,
      message: 'Line too long',
      file_path: 'server/main.py',
    },
  ];

  it('renders empty state when no issues are provided', () => {
    render(<IssuesList issues={[]} />);
    expect(screen.getByText('No Issues Found')).toBeInTheDocument();
  });

  it('renders list of issues correctly', () => {
    render(<IssuesList issues={mockIssues} />);
    expect(screen.getByText('Hardcoded password found')).toBeInTheDocument();
    expect(screen.getByText('Line too long')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('WARNING')).toBeInTheDocument();
  });

  it('calls onSelectIssue when an issue is clicked', () => {
    const handleSelect = vi.fn();
    render(<IssuesList issues={mockIssues} onSelectIssue={handleSelect} />);
    
    fireEvent.click(screen.getByText('Hardcoded password found'));
    expect(handleSelect).toHaveBeenCalledWith(mockIssues[0]);
  });
});
