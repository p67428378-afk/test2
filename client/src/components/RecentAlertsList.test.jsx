
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RecentAlertsList from './RecentAlertsList';

describe('RecentAlertsList', () => {
  it('renders the recent alerts list', () => {
    render(<RecentAlertsList />);
    expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
  });
});
