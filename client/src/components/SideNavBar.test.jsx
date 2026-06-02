
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SideNavBar from './SideNavBar';

describe('SideNavBar', () => {
  it('renders the side navigation bar', () => {
    render(<SideNavBar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
