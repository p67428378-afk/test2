import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
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
        <div style={{ padding: '2rem', color: '#ffb4ab', backgroundColor: '#0b1326', height: '100vh' }}>
          <h2>Something went wrong. Check console.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppLayout
      currentFilter={currentFilter}
      onFilterChange={setCurrentFilter}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardPage
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        searchQuery={searchQuery}
      />
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
