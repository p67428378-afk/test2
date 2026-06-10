import React, { useEffect, useState } from 'react';
import StatCardsGrid from '../components/dashboard/StatCardsGrid.jsx';
import PendingBookingsTable from '../components/dashboard/PendingBookingsTable.jsx';
import ClientCommunicationPanel from '../components/dashboard/ClientCommunicationPanel.jsx';
import SelectedTrekDetailsCard from '../components/dashboard/SelectedTrekDetailsCard.jsx';
import { getBookings } from '../services/api.js';

function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAccept = (id) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: 'ACCEPTED' } : b)
    );
  };

  const handleDecline = (id) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: 'DECLINED' } : b)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-on-surface-variant">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-section-gap">
      {/* Row 1: Stats Grid */}
      <StatCardsGrid
        bookingsCount={48}
        pendingCount={bookings.filter(b => b.status === 'PENDING').length}
        activeCount={5}
        slotsCount={12}
      />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-desktop">
        {/* Left Column (Tables & Chat) */}
        <div className="lg:col-span-2 space-y-section-gap">
          <PendingBookingsTable
            bookings={bookings}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
          <ClientCommunicationPanel />
        </div>

        {/* Right Column (Trek Details Sidebar) */}
        <div className="lg:col-span-1">
          <SelectedTrekDetailsCard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
