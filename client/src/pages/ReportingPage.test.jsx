
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReportingPage from './ReportingPage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('ReportingPage', () => {
  it('renders the reporting page', () => {
    render(<Router><ReportingPage /></Router>);
    const elements = screen.getAllByText('Reporting');
    expect(elements.length).toBeGreaterThan(0);
  });
});
