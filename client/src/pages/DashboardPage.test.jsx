import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import * as api from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

describe('DashboardPage', () => {
  it('renders the dashboard with metric cards', async () => {
    api.getPositions.mockResolvedValue({ data: [] });
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Total P&L (Today)')).toBeInTheDocument();
    });
    expect(screen.getByText('Open Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Positions')).toBeInTheDocument();
    expect(screen.getByText('Market Sentiment')).toBeInTheDocument();
  });
});
