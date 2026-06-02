
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginPage from './LoginPage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('LoginPage', () => {
  it('renders the login page', () => {
    render(<Router><LoginPage /></Router>);
    expect(screen.getByText('Log in to your account')).toBeInTheDocument();
  });
});
