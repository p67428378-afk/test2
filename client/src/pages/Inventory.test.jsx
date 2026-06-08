import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Inventory from './Inventory';
import * as api from '../services/api';

vi.mock('../services/api');

describe('Inventory page', () => {
  it('renders inventory data in a table', async () => {
    const inventoryData = [
      { id: 1, snack_name: 'Chips', quantity: 10, location: 'Aisle 1', expiry_date: '2025-01-01T00:00:00Z' },
      { id: 2, snack_name: 'Cookies', quantity: 20, location: 'Aisle 2', expiry_date: '2025-02-01T00:00:00Z' },
    ];

    api.getInventory.mockResolvedValue({ data: inventoryData });

    render(<Inventory />);

    expect(await screen.findByText('Chips')).toBeInTheDocument();
    expect(await screen.findByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });
});
