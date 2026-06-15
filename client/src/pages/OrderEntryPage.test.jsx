import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderEntryPage from './OrderEntryPage';

describe('OrderEntryPage', () => {
  it('renders the order entry form', () => {
    render(
      <MemoryRouter>
        <OrderEntryPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Create New Order')).toBeInTheDocument();
  });
});
