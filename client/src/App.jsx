import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Dashboard from './components/Dashboard';
import BookingList from './components/BookingList';
import RoomAvailability from './components/RoomAvailability';
import RevenueReport from './components/RevenueReport';
import StaffList from './components/StaffList';

function App() {
  return (
    <Router>
      <div className='flex'>
        <nav className='w-64 h-screen bg-gray-800 text-white'>
          <div className='p-4'>
            <h1 className='text-2xl font-bold'>Hotel Ops</h1>
          </div>
          <ul>
            <li className='p-4 hover:bg-gray-700'><Link to="/">Dashboard</Link></li>
            <li className='p-4 hover:bg-gray-700'><Link to="/bookings">Bookings</Link></li>
            <li className='p-4 hover:bg-gray-700'><Link to="/rooms">Rooms</Link></li>
            <li className='p-4 hover:bg-gray-700'><Link to="/finance">Finance</Link></li>
            <li className='p-4 hover:bg-gray-700'><Link to="/staff">Staff</Link></li>
          </ul>
        </nav>
        <main className='flex-1 p-10'>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/rooms" element={<RoomAvailability />} />
            <Route path="/finance" element={<RevenueReport />} />
            <Route path="/staff" element={<StaffList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
