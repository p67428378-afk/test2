import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the services/api module
vi.mock('./services/api', () => {
  return {
    authService: {
      isAuthenticated: () => false,
      getCurrentUser: () => null,
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe('App Smoke Test', () => {
  it('renders login page when unauthenticated', () => {
    render(<App />);
    expect(screen.getByText(/Sign in to ApexBank/i)).toBeInTheDocument();
  });
});
