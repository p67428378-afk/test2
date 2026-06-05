import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrderBlotterPage from './OrderBlotterPage';
import * as api from '../services/api';
import { vi } from 'vitest';

vi.mock('../services/api');

describe('OrderBlotterPage', () => {
  it('renders the order blotter table with mock data', async () => {
    render(
      <MemoryRouter>
        <OrderBlotterPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
      expect(screen.getByText('ORD-002')).toBeInTheDocument();
      expect(screen.getByText('ORD-003')).toBeInTheDocument();
    });
  });
});
