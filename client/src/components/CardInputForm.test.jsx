import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardInputForm from './CardInputForm';

describe('CardInputForm', () => {
  it('renders the form correctly', () => {
    render(<CardInputForm />);
    expect(screen.getByLabelText('Daily Spend Threshold')).toBeInTheDocument();
    expect(screen.getByText('SMS')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Proceed to OTP Verification/i })).toBeInTheDocument();
  });

  it('submits the form with the correct data', () => {
    const handleSubmit = vi.fn();
    render(<CardInputForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText('Daily Spend Threshold'), { target: { value: '150' } });
    fireEvent.click(screen.getByText('Email'));
    fireEvent.click(screen.getByRole('button', { name: /Proceed to OTP Verification/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      card_number: '************1234',
      daily_spend_threshold: 150,
      alert_delivery_channel: 'Email',
    });
  });
});
