import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';

describe('Sidebar component', () => {
  it('renders the navigation links', () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Snack Inventory')).toBeInTheDocument();
    expect(screen.getByText('Request Snack')).toBeInTheDocument();
    expect(screen.getByText('Mark Consumed')).toBeInTheDocument();
    expect(screen.getByText('Expiry Management')).toBeInTheDocument();
  });
});
