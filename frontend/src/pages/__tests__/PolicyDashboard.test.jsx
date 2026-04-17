import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyDashboard from '../PolicyDashboard';

describe('PolicyDashboard', () => {
  it('renders the policy dashboard', () => {
    render(<PolicyDashboard />);
    expect(screen.getByText('Gold Plan')).toBeInTheDocument();
    expect(screen.getByText('Monthly Premium')).toBeInTheDocument();
    expect(screen.getByText('$300.00')).toBeInTheDocument();
  });
});
