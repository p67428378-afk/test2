import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('renders sidebar logo', () => {
    const setActiveTab = vi.fn();
    render(<Sidebar activeTab="dashboard" setActiveTab={setActiveTab} />);

    expect(screen.getByText('EternalRest')).toBeDefined();
  });
});