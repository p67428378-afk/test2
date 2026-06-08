import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Dashboard from './Dashboard';
import * as api from '../services/api';

vi.mock('../services/api');

describe('Dashboard page', () => {
  it('renders dashboard with inventory and expiry alerts', async () => {
    const inventoryData = [{ id: 1, snack_name: 'Chips', quantity: 5, location: 'Shelf', expiry_date: '2024-12-31T00:00:00Z' }];
    const expiryAlertsData = [{ id: 1, snack_name: 'Milk', quantity: 1, expiry_date: '2024-07-01T00:00:00Z', alert_status: 'critical' }];

    api.getInventory.mockResolvedValue({ data: inventoryData });
    api.getExpiryAlerts.mockResolvedValue({ data: expiryAlertsData });

    render(<Dashboard />);

    expect(await screen.findByText('Current Inventory')).toBeInTheDocument();
    expect(await screen.findByText('5')).toBeInTheDocument(); // Total items
    expect(await screen.findByText('Expiry Alerts')).toBeInTheDocument();
    expect(await screen.findByText('Milk')).toBeInTheDocument();
  });
});
