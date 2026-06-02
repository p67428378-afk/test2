
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertThresholdForm from './AlertThresholdForm';

describe('AlertThresholdForm', () => {
  it('renders the alert threshold form', () => {
    render(<AlertThresholdForm />);
    expect(screen.getByText('Threshold Percentage (%)')).toBeInTheDocument();
  });
});
