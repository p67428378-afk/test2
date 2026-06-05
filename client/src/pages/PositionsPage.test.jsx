import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PositionsPage from './PositionsPage';
import * as api from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

describe('PositionsPage', () => {
  it('renders the positions table with mock data', async () => {
    const mockPositions = [
      { instrument_id: 'AAPL', quantity: 100, average_price: 150.00, current_price: 155.00, pnl: 500.00, updated_at: new Date().toISOString() },
      { instrument_id: 'GOOG', quantity: 50, average_price: 2800.00, current_price: 2790.00, pnl: -500.00, updated_at: new Date().toISOString() },
    ];
    api.getPositions.mockResolvedValue({ data: mockPositions });

    render(
      <MemoryRouter>
        <PositionsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('GOOG')).toBeInTheDocument();
    });
  });
});
