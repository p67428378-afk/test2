import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OverdraftProtectionSettings from '../components/OverdraftProtectionSettings';

// Mock fetch API
global.fetch = vi.fn();

describe('OverdraftProtectionSettings', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock initial fetch calls
    fetch.mockImplementation((url) => {
      if (url.includes('/overdraft/linked-account/chk123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ is_enabled: true, savings_account_id: 'sav456', checking_account_id: 'chk123', customer_id: 'cust123', id: '1', linked_date: new Date().toISOString() }),
        });
      } else if (url.includes('/overdraft/preferences/cust123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ customer_id: 'cust123', email_enabled: true, sms_enabled: false }),
        });
      } else if (url.includes('/overdraft/chk123/history')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 'evt1', transaction_id: 'txn1', checking_account_id: 'chk123', savings_account_id: 'sav456', amount: 50.0, status: 'Success', timestamp: new Date().toISOString() },
            { id: 'evt2', transaction_id: 'txn2', checking_account_id: 'chk123', savings_account_id: 'sav456', amount: 120.0, status: 'Success', timestamp: new Date().toISOString() },
          ]),
        });
      }
      return Promise.reject(new Error('not mocked'));
    });
  });

  it('renders correctly with initial data', async () => {
    render(<OverdraftProtectionSettings />);

    await waitFor(() => {
      expect(screen.getByText('Overdraft Protection Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Enable Overdraft Protection')).toBeChecked();
      expect(screen.getByText('Savings Account (**** 5678)')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Notifications')).toBeChecked();
      expect(screen.getByLabelText('SMS Notifications')).not.toBeChecked();
      expect(screen.getByText('$50.00')).toBeInTheDocument();
      expect(screen.getByText('$120.00')).toBeInTheDocument();
    });
  });

  it('toggles overdraft protection status', async () => {
    render(<OverdraftProtectionSettings />);

    await waitFor(() => expect(screen.getByLabelText('Enable Overdraft Protection')).toBeChecked());

    fetch.mockImplementationOnce((url, options) => {
      if (url.includes('/overdraft/linked-account/chk123/status') && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ is_enabled: false, savings_account_id: 'sav456', checking_account_id: 'chk123', customer_id: 'cust123', id: '1', linked_date: new Date().toISOString() }),
        });
      }
      return Promise.reject(new Error('not mocked'));
    });

    fireEvent.click(screen.getByLabelText('Enable Overdraft Protection'));

    await waitFor(() => expect(screen.getByLabelText('Enable Overdraft Protection')).not.toBeChecked());
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/overdraft/linked-account/chk123/status',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ is_enabled: false }),
      })
    );
  });

  it('updates email notification preference', async () => {
    render(<OverdraftProtectionSettings />);

    await waitFor(() => expect(screen.getByLabelText('Email Notifications')).toBeChecked());

    fetch.mockImplementationOnce((url, options) => {
      if (url.includes('/overdraft/preferences/cust123') && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ customer_id: 'cust123', email_enabled: false, sms_enabled: false }),
        });
      }
      return Promise.reject(new Error('not mocked'));
    });

    fireEvent.click(screen.getByLabelText('Email Notifications'));

    await waitFor(() => expect(screen.getByLabelText('Email Notifications')).not.toBeChecked());
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/overdraft/preferences/cust123',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ email_enabled: false }),
      })
    );
  });

  it('updates SMS notification preference', async () => {
    render(<OverdraftProtectionSettings />);

    await waitFor(() => expect(screen.getByLabelText('SMS Notifications')).not.toBeChecked());

    fetch.mockImplementationOnce((url, options) => {
      if (url.includes('/overdraft/preferences/cust123') && options.method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ customer_id: 'cust123', email_enabled: true, sms_enabled: true }),
        });
      }
      return Promise.reject(new Error('not mocked'));
    });

    fireEvent.click(screen.getByLabelText('SMS Notifications'));

    await waitFor(() => expect(screen.getByLabelText('SMS Notifications')).toBeChecked());
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/overdraft/preferences/cust123',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ sms_enabled: true }),
      })
    );
  });

  it('links a new savings account', async () => {
    render(<OverdraftProtectionSettings />);

    await waitFor(() => expect(screen.getByDisplayValue('Savings Account (**** 5678)')).toBeInTheDocument());

    fetch.mockImplementationOnce((url, options) => {
      if (url.includes('/overdraft/link-account') && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Account linked successfully', linked_account: { is_enabled: true, savings_account_id: 'sav9012', checking_account_id: 'chk123', customer_id: 'cust123', id: '2', linked_date: new Date().toISOString() } }),
        });
      }
      return Promise.reject(new Error('not mocked'));
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sav9012' } });

    await waitFor(() => expect(screen.getByDisplayValue('Savings Account (**** 9012)')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/overdraft/link-account',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          customer_id: 'cust123',
          checking_account_id: 'chk123',
          savings_account_id: 'sav9012',
        }),
      })
    );
  });

  it('unlinks an account', async () => {
    render(<OverdraftProtectionSettings />);

    await waitFor(() => expect(screen.getByText('Unlink')).toBeInTheDocument());

    fetch.mockImplementationOnce((url, options) => {
      if (url.includes('/overdraft/unlink-account/chk123') && options.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Account unlinked successfully' }),
        });
      }
      return Promise.reject(new Error('not mocked'));
    });

    fireEvent.click(screen.getByText('Unlink'));

    await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('none'));
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8000/overdraft/unlink-account/chk123',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});
