import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders the dashboard', () => {
    render(<Dashboard />);
    expect(screen.getByText('Portfolio Risk Suite')).toBeInTheDocument();
  });
});
