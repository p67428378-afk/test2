import React, { useState, useEffect } from 'react';
import SearchFilterBar from '../components/bookings/SearchFilterBar.jsx';
import FloorPlanView from '../components/bookings/FloorPlanView.jsx';
import CubicleDetailPanel from '../components/bookings/CubicleDetailPanel.jsx';
import { cubicleService, bookingService } from '../services/api.js';

export default function DashboardPage({ searchQuery, onBookingSuccess }) {
  const [selectedDate, setSelectedDate] = useState('2026-05-19');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [cubicles, setCubicles] = useState([]);
  const [selectedCubicle, setSelectedCubicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCubicles = async () => {
    setLoading(true);
    setError('');
    try {
      const amenitiesParam = selectedAmenities.join(',');
      const data = await cubicleService.getCubicles(selectedDate, amenitiesParam);
      
      // Filter by search query if present
      let filtered = data;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = data.filter(c => 
          c.name.toLowerCase().includes(query) || 
          c.location.toLowerCase().includes(query)
        );
      }
      
      setCubicles(filtered);
      
      // Reset selected cubicle if it's no longer in the list or not available
      if (selectedCubicle) {
        const current = filtered.find(c => c.id === selectedCubicle.id);
        if (!current || !current.is_available) {
          setSelectedCubicle(null);
        }
      }
    } catch (err) {
      setError('Failed to load cubicles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCubicles();
  }, [selectedDate, searchQuery]);

  const handleSearch = () => {
    fetchCubicles();
  };

  const handleBook = async () => {
    if (!selectedCubicle) return;
    setBookingLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await bookingService.createBooking(selectedCubicle.id, selectedDate);
      setSuccessMessage(`Successfully booked Cubicle ${selectedCubicle.name} for ${selectedDate}!`);
      setSelectedCubicle(null);
      fetchCubicles();
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (err) {
      setError('Failed to book cubicle. It might have been booked by someone else.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <>
      {/* Filter Bar */}
      <SearchFilterBar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
        onSearch={handleSearch}
      />

      {/* Notifications / Messages */}
      {error && (
        <div className='bg-rose-override/10 border border-rose-override/20 text-rose-override px-4 py-3 rounded-lg text-sm flex items-center gap-2'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className='bg-emerald-override/10 border border-emerald-override/20 text-emerald-override px-4 py-3 rounded-lg text-sm flex items-center gap-2'>
          <span className='material-symbols-outlined'>check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
        <FloorPlanView
          cubicles={cubicles}
          selectedCubicle={selectedCubicle}
          onSelectCubicle={setSelectedCubicle}
          loading={loading}
        />
        <CubicleDetailPanel
          cubicle={selectedCubicle}
          selectedDate={selectedDate}
          onBook={handleBook}
          bookingLoading={bookingLoading}
        />
      </div>
    </>
  );
}