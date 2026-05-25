import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SummaryCard from './SummaryCard';
import { Gem } from 'lucide-react';

describe('SummaryCard', () => {
  it('renders the title, value, and icon', () => {
    render(<SummaryCard title="Total Items" value="123" icon={<Gem data-testid="icon" />} />);

    expect(screen.getByText('Total Items')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
