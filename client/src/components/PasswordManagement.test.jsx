
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordManagement from './PasswordManagement';

describe('PasswordManagement', () => {
  it('renders the password management form', () => {
    render(<PasswordManagement />);
    expect(screen.getByText('Current Password')).toBeInTheDocument();
  });
});
