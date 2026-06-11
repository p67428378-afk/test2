import React from 'react';

export default function SearchFilterBar({ selectedDate, setSelectedDate, selectedAmenities, setSelectedAmenities, onSearch }) {
  const amenitiesList = ['Dual Monitors', 'Standing Desk', 'Window View', 'Quiet Zone'];

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div className='bg-surface-override border border-outline-override rounded-lg p-4 flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15)]'>
      <div className='flex flex-wrap items-center gap-4'>
        {/* Date Picker */}
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm'>calendar_month</span>
          <input 
            type='date'
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className='bg-[#0F172A] border border-outline-override rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-override'
          />
        </div>
        <span className='text-on-surface-variant text-sm hidden sm:inline-block'>
          {selectedDate === '2026-05-19' ? 'Tomorrow' : ''}
        </span>
        
        {/* Amenities Filter */}
        <div className='h-6 w-px bg-outline-override hidden md:block mx-2'></div>
        <div className='flex flex-wrap items-center gap-3'>
          {amenitiesList.map((amenity) => (
            <label key={amenity} className='flex items-center gap-2 cursor-pointer group'>
              <input 
                type='checkbox'
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className='rounded border-outline-override bg-[#0F172A] text-indigo-override focus:ring-indigo-override focus:ring-offset-[#0F172A]'
              />
              <span className='text-xs font-semibold text-on-surface-variant group-hover:text-white transition-colors'>{amenity}</span>
            </label>
          ))}
        </div>
      </div>
      <button 
        onClick={onSearch}
        className='bg-indigo-override text-white font-medium py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors shrink-0 shadow-lg shadow-indigo-override/20'
      >
        Search Available
      </button>
    </div>
  );
}