# Weather Dashboard

A responsive web application that allows users to search for cities, view current weather conditions, see a 5-day forecast, and visualize temperature trends on an interactive chart.

## Features
- **City Search and Selection**: Search for cities by name and select them to view weather data.
- **Current Weather & 5-Day Forecast**: Displays temperature, humidity, wind speed, pressure, and a 5-day daily forecast.
- **Temperature Trend Chart**: Interactive visualization of temperature trends over the next 5 days.
- **Unit Toggle**: Instantly switch between Fahrenheit and Celsius.

---

## Full-Stack Local Development

This project consists of a FastAPI backend and a React/Vite frontend.

### Port Conventions
- **Backend**: Runs on port `8000`
- **Frontend**: Runs on port `5173`

---

### 1. Backend Setup (FastAPI)

#### Prerequisites
- Python 3.11+

#### Installation
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

#### Running the Server
Start the FastAPI development server:
```bash
uvicorn server.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.
Interactive API documentation (Swagger UI) is available at `http://localhost:8000/docs`.

#### Running Tests
Run the backend test suite using pytest:
```bash
pytest
```

---

### 2. Frontend Setup (React / Vite / Tailwind CSS)

#### Prerequisites
- Node.js 18+
- npm

#### Installation
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

#### Running the Frontend
Start the Vite development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

#### Running Tests
Run the frontend test suite:
```bash
npm run test
```
