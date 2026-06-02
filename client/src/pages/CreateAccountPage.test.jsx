
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CreateAccountPage from './CreateAccountPage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('CreateAccountPage', () => {
  it('renders the create account page', () => {
    render(<Router><CreateAccountPage /></Router>);
    expect(screen.getByText('Create your account')).toBeInTheDocument();
  });
});
