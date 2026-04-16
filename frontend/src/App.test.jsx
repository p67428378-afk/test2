
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App', () => {
  it('renders the Add to Cart button', () => {
    render(<App />);
    const button = screen.getByText('Add to Cart');
    expect(button).toBeInTheDocument();
  });

  it('calls the add to cart API when the button is clicked', () => {
    const postSpy = jest.spyOn(axios, 'post');
    render(<App />);
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    expect(postSpy).toHaveBeenCalledWith('/api/cart/add', {
      productId: '1',
      quantity: 1,
    });
  });

  it('updates the cart count when an item is added', async () => {
    axios.post.mockResolvedValue({ data: { cartItemCount: 1 } });
    render(<App />);
    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    const cartCount = await screen.findByText('1');
    expect(cartCount).toBeInTheDocument();
  });
});
