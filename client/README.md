# Hotel Management System - Frontend Client

Single-page React application for hotel operations staff to manage room inventory, reservations, front-desk check-in/check-out, and guest invoicing.

## Tech Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library + jsdom

## Setup & Local Development

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Ensure `.env` exists with:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Build & Test

- **Production Build**:
  ```bash
  npm run build
  ```
- **Run Tests**:
  ```bash
  npm test
  ```

## Architecture & Routes

- `/rooms`: Room Inventory & Housekeeping Dashboard
- `/reservations`: Guest Reservations & Booking Management
- `/front-desk`: Front Desk Check-In & Check-Out Desk
- `/invoices`: Guest Folios & Billing Breakdown
