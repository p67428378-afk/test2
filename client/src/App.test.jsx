import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App.jsx';

describe('App Component Smoke Test', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('DeskFlow')).not.toBeNull();
    expect(screen.getByText('Book a Workspace')).not.toBeNull();
  });
});