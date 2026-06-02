
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegistrationForm from './RegistrationForm';

describe('RegistrationForm', () => {
  it('renders the registration form', () => {
    render(<RegistrationForm />);
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });
});
