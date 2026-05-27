import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertStatusDisplay from './AlertStatusDisplay';

describe('AlertStatusDisplay', () => {
  it('renders the success message with correct data', () => {
    const mockData = {
      status: 'ACTIVE',
      threshold_amount: 200.50,
      alert_delivery_channel: 'Email',
    };

    render(<AlertStatusDisplay data={mockData} />);

    expect(screen.getByText('Alert Setup Successful!')).toBeInTheDocument();
    expect(screen.getByText(/ACTIVE/)).toBeInTheDocument();
    expect(screen.getByText(/\$200.50/)).toBeInTheDocument();
    expect(screen.getByText(/Email/)).toBeInTheDocument();
  });
});
