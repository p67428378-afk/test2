
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UsageCharts from './UsageCharts';

describe('UsageCharts', () => {
  it('renders the usage charts', () => {
    render(<UsageCharts />);
    expect(screen.getByText('Consumption Trends')).toBeInTheDocument();
  });
});
