import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AlertSetupForm from './AlertSetupForm';
import * as api from '../services/api';

// Mock the api module
vi.mock('../services/api', () => ({
  setupLowBalanceAlert: vi.fn(),
}));

describe('AlertSetupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AlertSetupForm />);
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/threshold amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery channel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /set alert/i })).toBeInTheDocument();
  });

  it('shows an error for invalid account number and does not submit', async () => {
    render(<AlertSetupForm />);
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /set alert/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid 10-digit account number/i)).toBeInTheDocument();
    });

    expect(api.setupLowBalanceAlert).not.toHaveBeenCalled();
  });

  it('submits the form and shows a success message', async () => {
    const mockResponse = {
      data: {
        status: 'ACTIVE',
        confirmed_threshold: '500.00',
        delivery_channel: 'SMS',
      },
    };
    api.setupLowBalanceAlert.mockResolvedValue(mockResponse);

    render(<AlertSetupForm />);

    fireEvent.change(screen.getByLabelText(/account number/i), { target: { name: 'account_number', value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/threshold amount/i), { target: { name: 'threshold_amount', value: '500.00' } });
    fireEvent.change(screen.getByLabelText(/delivery channel/i), { target: { name: 'delivery_channel', value: 'SMS' } });

    fireEvent.click(screen.getByRole('button', { name: /set alert/i }));

    await waitFor(() => {
      expect(api.setupLowBalanceAlert).toHaveBeenCalledWith({
        account_number: '1234567890',
        threshold_amount: '500.00',
        delivery_channel: 'SMS',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/alert successfully set!/i)).toBeInTheDocument();
      expect(screen.getByText(/Confirmed Threshold: 500.00 | Delivery Channel: SMS/i)).toBeInTheDocument();
    });
  });

  it('shows an error message on api failure', async () => {
    const error = { response: { data: { detail: 'Failed to set alert' } } };
    api.setupLowBalanceAlert.mockRejectedValue(error);

    render(<AlertSetupForm />);
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { name: 'account_number', value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /set alert/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to set alert/i)).toBeInTheDocument();
    });
  });
});
