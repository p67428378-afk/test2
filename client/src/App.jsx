import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/layout/TopNavBar';
import Footer from './components/layout/Footer';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <div className='bg-surface dark:bg-surface text-on-surface min-h-screen flex flex-col font-sans selection:bg-primary-container selection:text-on-primary-container'>
        <TopNavBar />
        <Routes>
          <Route path='/' element={<CalculatorPage />} />
          <Route path='/about' element={<AboutPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
