import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main application page', () => {
    render(<App />);
    expect(screen.getByText('SecurePay Alerts')).toBeInTheDocument();
    expect(screen.getByText(/Set Up Debit Card Spend Alert/i)).toBeInTheDocument();
  });
});
