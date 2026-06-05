import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderBlotterPage from './OrderBlotterPage';

describe('OrderBlotterPage', () => {
  it('renders the order blotter title', async () => {
    render(
      <MemoryRouter>
        <OrderBlotterPage />
      </MemoryRouter>
    );
    expect(await screen.findByText('Order Blotter')).toBeInTheDocument();
  });
});
