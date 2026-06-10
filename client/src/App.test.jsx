import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Sidebar from './components/layout/Sidebar.jsx';

describe('Sidebar Smoke Test', () => {
  it('renders sidebar links correctly', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    
    // Check if the sidebar brand is rendered
    expect(screen.getByText('TrekGuide')).toBeInTheDocument();
    expect(screen.getByText('Pro Portal')).toBeInTheDocument();
    
    // Check if navigation links are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Bookings')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
  });
});
