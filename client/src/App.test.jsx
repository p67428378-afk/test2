import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';

// Mock the API calls
vi.mock('./services/api', () => ({
  getManuscripts: vi.fn().mockResolvedValue([]),
  getStylesheets: vi.fn().mockResolvedValue([]),
}));

describe('App Component Smoke Test', () => {
  it('renders without crashing', async () => {
    render(<App />);
    // Check if the sidebar logo is rendered
    expect(screen.getByText('PaperFlow')).toBeInTheDocument();
  });
});
