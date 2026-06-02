
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardPage from './DashboardPage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('DashboardPage', () => {
  it('renders the dashboard page', () => {
    render(<Router><DashboardPage /></Router>);
    expect(screen.getByText('System Overview')).toBeInTheDocument();
  });
});
