import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderEntryPage from './OrderEntryPage';
import * as api from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

describe('OrderEntryPage', () => {
  it('renders the order form and TCA estimate display', () => {
    render(
      <MemoryRouter>
        <OrderEntryPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Create New Order')).toBeInTheDocument();
    expect(screen.getByText('TCA Estimate')).toBeInTheDocument();
  });

  it('submits an order and shows a success message', async () => {
    api.createOrder.mockResolvedValue({ data: { order_id: 'ORD-123' } });
    render(
      <MemoryRouter>
        <OrderEntryPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getAllByLabelText('Instrument ID')[0], { target: { value: 'AAPL' } });
    fireEvent.change(screen.getAllByLabelText('Quantity')[0], { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '150.00' } });
    fireEvent.click(screen.getByText('Place Order'));

    await waitFor(() => {
      expect(screen.getByText('Order ORD-123 created successfully.')).toBeInTheDocument();
    });
  });
});
