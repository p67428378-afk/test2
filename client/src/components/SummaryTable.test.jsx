
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SummaryTable from './SummaryTable';

describe('SummaryTable', () => {
  it('renders the summary table', () => {
    render(<SummaryTable />);
    expect(screen.getByText('Optimization')).toBeInTheDocument();
  });
});
