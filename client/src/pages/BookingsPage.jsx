import React, { useEffect, useState } from 'react';
import { getBookings } from '../services/api.js';
import { Calendar, User, Compass, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'DECLINED':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <AlertCircle className="w-5 h-5 text-secondary" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'DECLINED':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-on-surface-variant">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">All Bookings</h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary-container font-bold text-lg">
                {booking.client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-headline-md text-lg text-on-surface flex items-center gap-2">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  {booking.client.name}
                </h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-2 mt-1">
                  <Compass className="w-4 h-4" />
                  {booking.trek.name} ({booking.duration || '14 days'})
                </p>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2">
              <div className="text-on-surface-variant text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {booking.start_date} to {booking.end_date}
              </div>
              <span className={`px-3 py-1 rounded-full font-caption text-caption inline-flex items-center gap-1.5 border ${getStatusClass(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsPage;
