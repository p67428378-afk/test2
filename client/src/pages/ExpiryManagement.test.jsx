import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExpiryManagement from './ExpiryManagement';
import * as api from '../services/api';

vi.mock('../services/api');

describe('ExpiryManagement page', () => {
  it('renders expiry alerts data in a table', async () => {
    const expiryAlertsData = [
      { id: 1, snack_name: 'Milk', quantity: 2, location: 'Fridge', expiry_date: '2024-07-10T00:00:00Z', alert_status: 'critical' },
      { id: 2, snack_name: 'Yogurt', quantity: 5, location: 'Fridge', expiry_date: '2024-07-15T00:00:00Z', alert_status: 'warning' },
    ];

    api.getExpiryAlerts.mockResolvedValue({ data: expiryAlertsData });

    render(<ExpiryManagement />);

    expect(await screen.findByText('Milk')).toBeInTheDocument();
    expect(await screen.findByText('Yogurt')).toBeInTheDocument();
    expect(screen.getByText('critical')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();
  });
});
