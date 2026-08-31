# 🍫 Cacao Royale &mdash; Exotic Chocolate Storefront Client

Artisanal Exotic Chocolate Storefront & Order Management System built with React 18, Vite, and Tailwind CSS.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Configure Environment

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your running FastAPI backend (defaults to `http://localhost:8000`).

### 3. Start Development Server

```bash
npm run dev
```

The application will run locally at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

### 5. Run Unit Tests

```bash
npm test
```

## 🛠️ Tech Stack & Key Features

- **Framework**: React 18 (SPA)
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (Catalog, Product Detail, Cart, Checkout, Order Confirmation)
- **State Management**: React Context API (`CartContext`) with localStorage persistence
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + JSDOM

## 📋 Features

- **Multi-faceted Catalog Browsing**: Cocoa percentage slider (50%–100%), Origin Regions, Tasting Notes, Dietary Filters.
- **Product Details & Heat Advisories**: In-depth tasting notes and automated thermal cold-pack shipping alerts.
- **Persistent Cart Management**: Inventory bounded quantity updates and real-time subtotal calculations.
- **Temperature-Controlled Checkout**: Toggle between Standard Ground and Express Thermal Shipping (+Cold Pack).
- **UUID-Based Order Tracking**: Itemized receipts and instant order status monitoring.
