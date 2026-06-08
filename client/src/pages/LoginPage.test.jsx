import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as api from '../services/api';

// Mock the api module
vi.mock('../services/api', () => ({
  login: vi.fn(),
}));

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('LoginPage', () => {
  it('renders login form and handles successful login', async () => {
    const mockToken = 'fake-token';
    api.login.mockResolvedValue({ data: { access_token: mockToken } });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for assertions
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows an error message on failed login', async () => {
    api.login.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    const error = await screen.findByText('Failed to login. Please check your credentials.');
    expect(error).toBeInTheDocument();
  });
});
