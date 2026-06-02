
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });
});
