import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultDisplay from './ResultDisplay';

describe('ResultDisplay', () => {
  test('renders nothing when premium is null', () => {
    render(<ResultDisplay premium={null} />);
    const premiumResult = screen.queryByText(/\$/);
    expect(premiumResult).toBeNull();
  });

  test('renders premium when value is provided', () => {
    render(<ResultDisplay premium={420.00} />);
    const premiumResult = screen.getByText(/\$420.00/);
    expect(premiumResult).toBeInTheDocument();
  });
});
