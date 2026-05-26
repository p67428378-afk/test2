import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../components/Header';

describe('Header Component', () => {
  it('renders the dashboard title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/Influencer Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Header />);
    const searchInput = screen.getByPlaceholderText(/Search data.../i);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders the user name', () => {
    render(<Header />);
    const userNameElement = screen.getByText(/Jane Doe/i);
    expect(userNameElement).toBeInTheDocument();
  });
});
