import { render, screen } from '@testing-library/react';
import AccountSummaryCard from './AccountSummaryCard';
import React from 'react';

describe('AccountSummaryCard', () => {
  const mockAccount = {
    account_holder_name: 'John Doe',
    account_number: '**** **** **** 1234',
    account_type: 'Savings Account',
    current_balance: 10000,
    currency: 'USD'
  };

  it('test_display_account_holder_name', () => {
    render(<AccountSummaryCard account={mockAccount} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('test_display_account_number', () => {
    render(<AccountSummaryCard account={mockAccount} />);
    expect(screen.getByText('**** **** **** 1234')).toBeInTheDocument();
  });

  it('test_display_account_type', () => {
    render(<AccountSummaryCard account={mockAccount} />);
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
  });

  it('test_display_current_balance', () => {
    render(<AccountSummaryCard account={mockAccount} />);
    expect(screen.getByText((content, element) => {
        return content.includes('$10,000.00')
    })).toBeInTheDocument();
  });

});
