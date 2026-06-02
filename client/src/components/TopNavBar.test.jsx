
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TopNavBar from './TopNavBar';

describe('TopNavBar', () => {
  it('renders the top navigation bar', () => {
    render(<TopNavBar />);
    expect(screen.getByText('WaterWise')).toBeInTheDocument();
  });
});
