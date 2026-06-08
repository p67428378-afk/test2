import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the API service
vi.mock('./services/api', () => ({
  listCertificates: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  getDownloadUrl: vi.fn((id) => `http://localhost:8000/api/v1/certificates/${id}/download`),
}));

describe('App Smoke Test', () => {
  it('renders the App component and sidebar', async () => {
    render(<App />);
    
    // Check if the sidebar brand header is present
    expect(screen.getByText('Apex Bank')).toBeInTheDocument();
    expect(screen.getByText('Wealth Management')).toBeInTheDocument();
  });
});
