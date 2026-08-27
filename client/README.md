# Podcast Discovery Hub - Frontend Client

Responsive React 18 + Vite + Tailwind CSS web application for discovering podcasts, exploring episodes, and streaming audio.

## Features

- **Podcast Catalog Browsing**: Search podcasts by keywords, filter by categories (Technology, Business, Comedy, Education, Science), and browse responsive show cards.
- **Show Detail & Paginated Episodes**: Detailed show header banner with subscriber statistics, category tags, and paginated episode lists (10 per page) sorted by newest first.
- **Interactive Audio Player**: Persistent sticky bottom player supporting Play/Pause, 15s skip back/forward, direct scrubbing, volume slider, playback speed control (0.5x to 2.0x), and automatic reconnect handling.
- **Show Notes & Chapter Markers**: 2-column episode detail page with full show notes, clickable timestamp chapters that seek the audio stream, and links to external resources.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library + jsdom

## Getting Started

### 1. Installation

```bash
cd client
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Development Server

Start Vite dev server on port 5173:

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Run Unit Tests

```bash
npm test
```
