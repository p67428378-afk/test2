import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TransferPage from './TransferPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('TransferPage', () => {
  const mockAccounts = [
    { account_id: '1', account_number: '1234', account_type: 'checking', balance: 1000 },
    { account_id: '2', account_number: '5678', account_type: 'savings', balance: 5000 },
  ];

  beforeEach(() => {
    api.getAccounts.mockResolvedValue({ data: mockAccounts });
  });

  it('renders the transfer form and populates accounts', async () => {
    render(
      <Router>
        <TransferPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('From')).toBeInTheDocument();
      expect(screen.getByLabelText('To')).toBeInTheDocument();
      expect(screen.getByLabelText('Amount')).toBeInTheDocument();
      expect(screen.getAllByRole('option').length).toBe(4); // 2 for each select
    });
  });

  it('allows a user to perform a transfer', async () => {
    api.createTransfer.mockResolvedValue({ data: { transfer_id: 'xyz-123' } });

    render(
      <Router>
        <TransferPage />
      </Router>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Transfer/i }));

    await waitFor(() => {
      expect(api.createTransfer).toHaveBeenCalledWith({
        from_account_id: '1',
        to_account_id: '2',
        amount: 100,
      });
      expect(screen.getByText(/Transfer successful!/)).toBeInTheDocument();
    });
  });

  it('shows an error if transfer fails', async () => {
    api.createTransfer.mockRejectedValue({ response: { data: { detail: 'Insufficient funds' } } });

    render(
      <Router>
        <TransferPage />
      </Router>
    );

    await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '9999' } });
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Transfer/i }));

    await waitFor(() => {
      expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
    });
  });
});
