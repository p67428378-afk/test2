import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('renders title correctly', () => {
    const mockSetIsSidebarOpen = vi.fn();
    const mockSetActiveTab = vi.fn();

    render(
      <Header
        title="Dashboard"
        setIsSidebarOpen={mockSetIsSidebarOpen}
        setActiveTab={mockSetActiveTab}
      />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
