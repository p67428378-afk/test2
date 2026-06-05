import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderEntryPage from './OrderEntryPage';
import { vi } from 'vitest';

// Mock child components
vi.mock('../components/orders/OrderForm', () => ({ 
  default: () => <div>OrderForm</div> 
}));
vi.mock('../components/tca/TCAEstimateDisplay', () => ({ 
  default: () => <div>TCAEstimateDisplay</div> 
}));

describe('OrderEntryPage', () => {
  it('renders the order form and TCA estimate components', () => {
    render(
      <MemoryRouter>
        <OrderEntryPage />
      </MemoryRouter>
    );

    expect(screen.getByText('OrderForm')).toBeInTheDocument();
    expect(screen.getByText('TCAEstimateDisplay')).toBeInTheDocument();
  });
});
