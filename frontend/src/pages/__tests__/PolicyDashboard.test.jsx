import React from 'react';
import { render, screen } from '@testing-library/react';
import PolicyDashboard from '../PolicyDashboard';
import { getPolicies } from '../../services/policyService';
import { BrowserRouter as Router } from 'react-router-dom';

vi.mock('../../services/policyService');

describe('PolicyDashboard', () => {
  it('renders policy data correctly', async () => {
    const mockPolicies = [
      {
        id: '1',
        policy_number: 'POL-123',
        plan_type: 'Gold Plan',
        premium_amount: 300,
        effective_date: '2024-01-01',
        expiration_date: '2024-12-31',
        status: 'Active',
      },
    ];
    getPolicies.mockResolvedValue(mockPolicies);

    render(
      <Router>
        <PolicyDashboard />
      </Router>
    );

    expect(await screen.findByText('Gold Plan')).toBeInTheDocument();
    expect(screen.getByText('$300/mo')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('Dec 31, 2024')).toBeInTheDocument();
  });
});
