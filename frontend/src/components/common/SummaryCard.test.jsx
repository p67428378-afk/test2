import { render, screen } from '@testing-library/react';
import SummaryCard from './SummaryCard';
import { describe, it, expect } from 'vitest';
import { DollarSign } from 'lucide-react';

describe('SummaryCard', () => {
  it('renders the title and value', () => {
    render(<SummaryCard title="Total Revenue" value="$125,670" />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$125,670')).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(<SummaryCard title="Total Revenue" value="$125,670" icon={<DollarSign data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
