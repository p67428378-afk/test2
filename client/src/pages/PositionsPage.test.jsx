import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PositionsPage from './PositionsPage';

describe('PositionsPage', () => {
  it('renders the positions title', async () => {
    render(
      <MemoryRouter>
        <PositionsPage />
      </MemoryRouter>
    );
    expect(await screen.findByText('Current Positions')).toBeInTheDocument();
  });
});
