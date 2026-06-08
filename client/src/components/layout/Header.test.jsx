import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header component', () => {
  it('renders the dashboard title', () => {
    render(<Header />);
    expect(screen.getByText('Snacks Management Dashboard')).toBeInTheDocument();
  });
});
