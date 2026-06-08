import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ onLogout }) => {

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900">Law Firm OS</h1>
                </div>
                <nav className="mt-6">
                    <Link to="/" className="block px-6 py-2 text-gray-700 hover:bg-gray-200">Dashboard</Link>
                    <Link to="/clients" className="block px-6 py-2 text-gray-700 hover:bg-gray-200">Clients</Link>
                    <Link to="/matters" className="block px-6 py-2 text-gray-700 hover:bg-gray-200">Matters</Link>
                    <Link to="/documents" className="block px-6 py-2 text-gray-700 hover:bg-gray-200">Documents</Link>
                    <Link to="/time-tracking" className="block px-6 py-2 text-gray-700 hover:bg-gray-200">Time Tracking</Link>
                    <Link to="/billing" className="block px-6 py-2 text-gray-700 hover:bg-gray-200">Billing</Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <header className="flex items-center justify-between p-6 bg-white border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Logout</button>
                </header>
                <main className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Summary Cards */}
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-700">Active Cases</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-700">Pending Tasks</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-700">Total Clients</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">45</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-medium text-gray-700">Unbilled Hours</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900">34.5</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
