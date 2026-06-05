import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import * as api from '../services/api';
import { vi } from 'vitest';

// Mock API
vi.mock('../services/api');

// Mock child components
vi.mock('../components/dashboard/MetricCard', () => ({ 
  default: ({ title }) => <div>{title}</div> 
}));
vi.mock('../components/orders/OrderBlotterTable', () => ({ 
  default: () => <div>OrderBlotterTable</div> 
}));
vi.mock('../components/positions/PositionsTable', () => ({ 
  default: () => <div>PositionsTable</div> 
}));
vi.mock('../components/dashboard/MarketOverviewChart', () => ({ 
  default: () => <div>MarketOverviewChart</div> 
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    api.getPositions.mockResolvedValue({ data: [] });
  });

  it('renders the main sections of the dashboard', async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Wait for API call and state update
    await waitFor(() => {
      expect(api.getPositions).toHaveBeenCalledTimes(1);
    });

    // Check for metric cards (via mocked component)
    expect(screen.getByText('Total P&L (Today)')).toBeInTheDocument();
    expect(screen.getByText('Open Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Positions')).toBeInTheDocument();
    expect(screen.getByText('Market Sentiment')).toBeInTheDocument();

    // Check for other components
    expect(screen.getByText('OrderBlotterTable')).toBeInTheDocument();
    expect(screen.getByText('PositionsTable')).toBeInTheDocument();
    expect(screen.getByText('MarketOverviewChart')).toBeInTheDocument();
  });
});
