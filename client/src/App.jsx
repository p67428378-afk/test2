import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SubmissionPage from './pages/SubmissionPage.jsx';
import RevisionPage from './pages/RevisionPage.jsx';

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/submit' element={<SubmissionPage />} />
          <Route path='/revisions' element={<RevisionPage />} />
          <Route path='*' element={<DashboardPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
