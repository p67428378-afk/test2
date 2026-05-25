import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PolicyDetails from './components/PolicyDetails';
import PolicyUpdateRequest from './components/PolicyUpdateRequest';
import PolicyCancelRequest from './components/PolicyCancelRequest';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<PolicyDetails />} />
        <Route path="update" element={<PolicyUpdateRequest />} />
        <Route path="cancel" element={<PolicyCancelRequest />} />
      </Route>
    </Routes>
  );
}

export default App;
