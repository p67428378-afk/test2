import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PremiumCalculatorPage from './PremiumCalculatorPage';

describe('PremiumCalculatorPage', () => {
  it('renders the main heading', () => {
    render(<PremiumCalculatorPage />);
    const heading = screen.getByText(/Calculate Your Premium/i);
    expect(heading).toBeInTheDocument();
  });
});
