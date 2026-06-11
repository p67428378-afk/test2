import React, { useState } from 'react';
import AppLayout from './components/layout/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewBooking = () => {
    setCurrentPage('dashboard');
  };

  const handleBookingSuccess = () => {
    // Automatically redirect to My Bookings page after a short delay
    setTimeout(() => {
      setCurrentPage('bookings');
    }, 1500);
  };

  return (
    <AppLayout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      onNewBooking={handleNewBooking}
      title={currentPage === 'dashboard' ? 'Book a Workspace' : 'My Bookings'}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {currentPage === 'dashboard' ? (
        <DashboardPage 
          searchQuery={searchQuery} 
          onBookingSuccess={handleBookingSuccess}
        />
      ) : (
        <MyBookingsPage />
      )}
    </AppLayout>
  );
}