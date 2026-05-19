import React, { useState, useEffect } from 'react';
import { getRoomAvailability } from '../services/api';

const RoomAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomAvailability = async () => {
      try {
        const response = await getRoomAvailability();
        setRooms(response.data.rooms);
      } catch (err) {
        setError('Failed to fetch room availability.');
        console.error(err);
      }
    };

    fetchRoomAvailability();
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Room Availability</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {rooms.map(room => (
          <div key={room.id} className={`p-4 rounded-lg text-white ${getStatusColor(room.status)}`}>
            <div className='text-lg font-semibold'>{room.roomNumber}</div>
            <div>{room.type}</div>
            <div>{room.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAvailability;
