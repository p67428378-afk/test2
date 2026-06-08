import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import MaintenancePage from './pages/MaintenancePage';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in React tree:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ffb4ab', backgroundColor: '#13131b', minHeight: '100vh' }}>
          <h2>Something went wrong. Check console.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/alerts' element={<AlertsPage />} />
          <Route path='/maintenance' element={<MaintenancePage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
