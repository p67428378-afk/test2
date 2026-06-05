import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from './AppLayout';

describe('AppLayout', () => {
  it('renders the sidebar and header', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );
    expect(screen.getByText('Money Management')).toBeInTheDocument();
    expect(screen.getByText('Money Management System')).toBeInTheDocument();
  });
});
