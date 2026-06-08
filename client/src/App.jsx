import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Matters from './components/Matters';
import Documents from './components/Documents';
import TimeTracking from './components/TimeTracking';
import Billing from './components/Billing';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    {token ? (
                        <>
                            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
                            <Route path="/clients" element={<Clients token={token} />} />
                            <Route path="/matters" element={<Matters token={token} />} />
                            <Route path="/documents" element={<Documents token={token} />} />
                            <Route path="/time-tracking" element={<TimeTracking token={token} />} />
                            <Route path="/billing" element={<Billing token={token} />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
