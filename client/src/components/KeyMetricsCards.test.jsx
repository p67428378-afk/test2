
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KeyMetricsCards from './KeyMetricsCards';

describe('KeyMetricsCards', () => {
  it('renders the key metrics cards', () => {
    render(<KeyMetricsCards />);
    expect(screen.getByText('Current Usage')).toBeInTheDocument();
  });
});
