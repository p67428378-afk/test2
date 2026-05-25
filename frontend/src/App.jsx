import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApplicationFormPage from './pages/ApplicationFormPage';
import EligibilityResultPage from './pages/EligibilityResultPage';
import EligibleCardOptionsPage from './pages/EligibleCardOptionsPage';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ApplicationFormPage />} />
          <Route path="/result/:applicationId" element={<EligibilityResultPage />} />
          <Route path="/eligible-cards/:applicationId" element={<EligibleCardOptionsPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
