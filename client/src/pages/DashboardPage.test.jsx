import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('DashboardPage', () => {
  it('fetches and displays accounts', async () => {
    const mockAccounts = [
      { account_id: '1', account_number: '1234', account_type: 'checking', balance: 1000 },
      { account_id: '2', account_number: '5678', account_type: 'savings', balance: 5000 },
    ];
    api.getAccounts.mockResolvedValue({ data: mockAccounts });

    render(
      <Router>
        <DashboardPage />
      </Router>
    );

    expect(screen.getByText('Loading accounts...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('checking Account')).toBeInTheDocument();
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('savings Account')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });
  });

  it('displays an error message if fetching accounts fails', async () => {
    api.getAccounts.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <Router>
        <DashboardPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch accounts. Please try again later.')).toBeInTheDocument();
    });
  });
});
