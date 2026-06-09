import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SidebarNav from './components/SidebarNav';
import Dashboard from './pages/Dashboard';
import ScenarioComparison from './pages/ScenarioComparison';
import ApprovalReview from './pages/ApprovalReview';
import Confirmation from './pages/Confirmation';
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
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-8 max-w-md mx-auto mt-20 bg-red-50 border border-red-200 rounded-xl text-center space-y-4'>
          <h2 className='text-xl font-bold text-red-800'>Something went wrong.</h2>
          <p className='text-sm text-red-600'>Please check the console logs or refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-bold hover:bg-red-900 transition-colors'
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppLayout() {
  return (
    <div className='flex h-screen overflow-hidden bg-slate-50 font-sans antialiased'>
      {/* Sidebar Navigation */}
      <SidebarNav />

      {/* Main Content Area */}
      <div className='flex-1 ml-[260px] flex flex-col h-full relative'>
        {/* Top App Bar */}
        <header className='bg-white text-slate-800 flex justify-between items-center h-16 px-8 w-full border-b border-slate-100 shrink-0 z-10'>
          <div className='flex flex-col justify-center'>
            <h2 className='text-lg font-bold text-slate-900 leading-tight'>DG Cluster Assortment Advisor</h2>
            <p className='text-xs text-slate-500'>Small Town Value Cluster — Snacks Category</p>
          </div>
          <div className='flex items-center gap-4'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'>
              <span className='material-symbols-outlined text-[22px]'>notifications</span>
            </button>
            <button className='w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors'>
              <span className='material-symbols-outlined text-[22px]'>settings</span>
            </button>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className='flex-1 overflow-y-auto p-8'>
          <div className='max-w-5xl mx-auto'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='/scenarios' element={<ScenarioComparison />} />
              <Route path='/approval' element={<ApprovalReview />} />
              <Route path='/confirmation' element={<Confirmation />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
