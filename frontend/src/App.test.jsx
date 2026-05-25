import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';

const server = setupServer(
  rest.get('/api/count', (req, res, ctx) => {
    return res(ctx.json({ count: 0 }));
  }),
  rest.post('/api/increment', (req, res, ctx) => {
    return res(ctx.json({ count: 1 }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  it('renders the initial count', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('0'));
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('increments the count when the button is clicked', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('0'));

    fireEvent.click(screen.getByText('INCREMENT'));

    await waitFor(() => screen.getByText('1'));

    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
