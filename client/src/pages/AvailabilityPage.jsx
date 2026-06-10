import React, { useEffect, useState } from 'react';
import GuideCalendar from '../components/dashboard/GuideCalendar.jsx';
import { getAvailability } from '../services/api.js';

function AvailabilityPage() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const data = await getAvailability();
        setAvailability(data);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleToggleAvailability = (dateStr) => {
    setAvailability(prev => {
      const existing = prev.find(a => a.date === dateStr);
      if (existing) {
        return prev.map(a => a.date === dateStr ? { ...a, is_available: !a.is_available } : a);
      } else {
        return [...prev, { date: dateStr, start_time: '09:00', end_time: '17:00', is_available: true }];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-on-surface-variant">
        Loading availability...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">My Availability</h1>
      </div>

      <div className="max-w-4xl">
        <GuideCalendar
          availability={availability}
          onToggleAvailability={handleToggleAvailability}
        />
      </div>
    </div>
  );
}

export default AvailabilityPage;
