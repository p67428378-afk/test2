import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AccountDetailsPage from './AccountDetailsPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('AccountDetailsPage', () => {
  it('fetches and displays transaction history', async () => {
    const mockTransactions = [
      { transaction_id: '1', transaction_date: '2023-10-26T10:00:00Z', description: 'Coffee Shop', type: 'withdrawal', amount: 5.50 },
      { transaction_id: '2', transaction_date: '2023-10-25T14:30:00Z', description: 'Paycheck', type: 'deposit', amount: 1500 },
    ];
    api.getAccountTransactions.mockResolvedValue({ data: mockTransactions });

    render(
      <MemoryRouter initialEntries={['/accounts/123']}>
        <Routes>
          <Route path="/accounts/:accountId" element={<AccountDetailsPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading transactions...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.getByText('- $5.50')).toBeInTheDocument();
      expect(screen.getByText('Paycheck')).toBeInTheDocument();
      expect(screen.getByText('+ $1,500.00')).toBeInTheDocument();
    });
  });
});
