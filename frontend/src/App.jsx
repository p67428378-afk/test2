import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreditCardList from './pages/CreditCardList';
import ApplicationForm from './pages/ApplicationForm';
import ConfirmationPage from './pages/ConfirmationPage';

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-100'>
        <nav className='bg-blue-600 p-4 text-white flex justify-between items-center'>
          <h1 className='text-xl font-bold'>Credit Card Application</h1>
          <div>
            <Link to="/" className='mr-4 hover:underline'>Home</Link>
            <Link to="/apply" className='hover:underline'>Apply</Link>
          </div>
        </nav>
        <main className='p-4'>
          <Routes>
            <Route path="/" element={<CreditCardList />} />
            <Route path="/apply" element={<ApplicationForm />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
