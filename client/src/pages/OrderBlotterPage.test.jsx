import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderBlotterPage from './OrderBlotterPage';
import { vi } from 'vitest';

// Mock child component
vi.mock('../components/orders/OrderBlotterTable', () => ({ 
  default: ({ orders, title }) => (
    <div>
      <h1>{title}</h1>
      <ul>
        {orders.map(o => <li key={o.order_id}>{o.order_id}</li>)}
      </ul>
    </div>
  )
}));

describe('OrderBlotterPage', () => {
  it('renders the blotter table with a title and data', async () => {
    render(
      <MemoryRouter>
        <OrderBlotterPage />
      </MemoryRouter>
    );

    // Wait for the component to move past the loading state
    await waitFor(() => {
        expect(screen.getByText('Full Order Blotter')).toBeInTheDocument();
    });

    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-004')).toBeInTheDocument();
  });
});
