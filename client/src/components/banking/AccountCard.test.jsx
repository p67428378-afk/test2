import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AccountCard from './AccountCard';

describe('AccountCard', () => {
  const mockAccount = {
    id: '123',
    account_type: 'checking',
    account_number: '111-222-333',
    balance: 4500.00,
  };

  it('renders account details correctly', () => {
    render(<AccountCard account={mockAccount} />);
    
    expect(screen.getByText('checking')).toBeInTheDocument();
    expect(screen.getByText('111-222-333')).toBeInTheDocument();
    expect(screen.getByText('$4,500.00')).toBeInTheDocument();
  });
});
