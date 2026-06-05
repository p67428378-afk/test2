import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PositionsPage from './PositionsPage';
import * as api from '../services/api';
import { vi } from 'vitest';

// Mock API
vi.mock('../services/api');

// Mock child component
vi.mock('../components/positions/PositionsTable', () => ({ 
  default: ({ positions }) => (
    <div>
      <h1>Positions</h1>
      <ul>
        {positions.map(p => <li key={p.instrument_id}>{p.instrument_id}</li>)}
      </ul>
    </div>
  )
}));

describe('PositionsPage', () => {
  it('fetches and displays positions', async () => {
    const mockPositions = [
      { instrument_id: 'AAPL', quantity: 100, average_price: 150.00 },
      { instrument_id: 'GOOG', quantity: 50, average_price: 2800.00 },
    ];
    api.getPositions.mockResolvedValue({ data: mockPositions });

    render(
      <MemoryRouter>
        <PositionsPage />
      </MemoryRouter>
    );

    // Wait for loading to finish and data to be rendered
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('GOOG')).toBeInTheDocument();
    });

    expect(api.getPositions).toHaveBeenCalledWith('some-trader-id');
  });

  it('shows an error message if fetching fails', async () => {
    api.getPositions.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <PositionsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch positions.')).toBeInTheDocument();
    });
  });
});
