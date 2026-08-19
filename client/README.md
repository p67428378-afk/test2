# WiFi Maintenance Tracker — Frontend Client

A modern Single Page Application (SPA) built with **React 18**, **Vite**, and **Tailwind CSS** for recording WiFi maintenance activities, tracking maintenance expenses, and analyzing cost distributions over time.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

Clone the repository and navigate to the `client/` directory:

```bash
cd client
npm install
```

### Environment Configuration

The application reads the backend API endpoint from `VITE_API_BASE_URL`.
Generate your local configuration from the example file:

```bash
cp .env.example .env
```

Default configuration (`client/.env`):

```ini
VITE_API_BASE_URL=http://localhost:8000
```

### Running Local Development Server

Start the Vite development server on `http://localhost:5173`:

```bash
npm run dev
```

---

## 🧪 Testing & Production Build

### Running Unit Tests

Execute the Vitest test suite with jsdom environment:

```bash
npm run test
```

### Building for Production

Compile optimized production assets into `client/dist`:

```bash
npm run build
```

---

## 💡 Key Features & Architecture

1. **Cost Analytics Dashboard**:
   - Total spend metrics, total events, and average cost breakdown.
   - Interactive monthly cost trend chart.
   - Expense distribution toggle (by Maintenance Type vs by Location).

2. **Filterable Maintenance Log**:
   - Multi-criteria filtering by keyword, location, type, date range, and cost bounds.
   - Immediate empty-state messaging when no records match filters.

3. **Event Recording Modal**:
   - Form dialog for creating and updating maintenance logs.
   - Immediate form-level validation enforcing non-negative cost input ($0.00 warranty allowed).

4. **CSV Export**:
   - Download maintenance logs as CSV files directly from the backend API.
