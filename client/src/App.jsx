import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import ExpiryManagement from './pages/ExpiryManagement';
import RequestSnackForm from './components/forms/RequestSnackForm';
import MarkConsumedForm from './components/forms/MarkConsumedForm';

function App() {
  return (
    <Router>
      <div className='flex h-screen bg-background'>
        <Sidebar />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header />
          <main className='flex-1 overflow-x-hidden overflow-y-auto bg-background p-container-padding'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route path='snack-inventory' element={<Inventory />} />
              <Route path='request-snack' element={<RequestSnackForm />} />
              <Route path='mark-consumed' element={<MarkConsumedForm />} />
              <Route path='expiry-management' element={<ExpiryManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
