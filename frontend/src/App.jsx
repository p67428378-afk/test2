import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import PolicyManagement from './components/PolicyManagement';
import Beneficiaries from './components/Beneficiaries';
import PolicyCancellation from './components/PolicyCancellation';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/policy">Policy Management</Link>
            </li>
            <li>
              <Link to="/beneficiaries">Beneficiaries</Link>
            </li>
            <li>
              <Link to="/cancel">Policy Cancellation</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/policy" element={<PolicyManagement />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/cancel" element={<PolicyCancellation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
