# Netbanking Landing Page

This project is a frontend application for a netbanking landing page that displays a user's account details and bank balance.

## Application Architecture

- **Tech Stack**: React (Vite), Tailwind CSS
- **Communication**: The frontend communicates with a backend API to fetch account data. The API endpoint is `/api/v1/accounts/summary`.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── accounts/
│   │   │   ├── AccountDetail.jsx
│   │   │   ├── AccountSummaryCard.jsx
│   │   │   └── BalanceDisplay.jsx
│   │   ├── common/
│   │   │   ├── Card.jsx
│   │   │   └── ErrorMessage.jsx
│   │   └── layout/
│   │       ├── AppLayout.jsx
│   │       └── Header.jsx
│   ├── pages/
│   │   └── DashboardPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── test/
│   │   └── setup.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Prerequisites

- Node.js 18+
- npm

## Setup Instructions

1.  **Clone the repo**
2.  **Navigate to the `frontend` directory**:
    ```bash
    cd frontend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```

## Running Tests

To run the frontend tests, execute the following command in the `frontend` directory:

```bash
npm test
```
