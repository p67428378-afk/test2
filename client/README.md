# MarkdownStudio &mdash; Browser Markdown Editor Client

A web-based Markdown Editor with real-time live HTML preview, rich formatting toolbar, document persistence, and export options.

## Features

- **Live HTML Preview**: Real-time rendering with sub-100ms latency.
- **Formatting Toolbar**: Dedicated quick-action buttons for Bold, Italic, Headings (H1, H2, H3), Lists, Blockquotes, Links, Tables, and Code Blocks.
- **Document Management**: Save, load, edit, and delete documents via FastAPI backend integration.
- **Periodic Auto-Save**: Auto-saves every 30 seconds when changes are detected.
- **XSS Sanitization**: Secure client-side sanitization powered by DOMPurify.
- **Export Formats**: Export and download documents in Markdown (`.md`), HTML (`.html`), and Plain Text (`.txt`).
- **Safety**: 5MB document size guard and browser navigation warning on unsaved modifications.

## Tech Stack

- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Markdown & Security**: Marked, DOMPurify
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + jsdom

## Setup & Running Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your backend server (defaults to `http://localhost:8000`).

### 3. Start Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

### 5. Run Unit Tests

```bash
npm test
```
