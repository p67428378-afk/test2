import React from 'react';

export default function CubicleCard({ cubicle, isSelected, onSelect }) {
  const { name, location, amenities, is_available } = cubicle;

  const getAmenityIcon = (amenity) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('monitor')) return 'monitor';
    if (lower.includes('desk')) return 'desk';
    if (lower.includes('window')) return 'window';
    if (lower.includes('quiet') || lower.includes('headphone')) return 'headphones';
    return null;
  };

  if (!is_available) {
    return (
      <div className='border border-outline-override bg-[#0F172A] rounded-lg p-3 opacity-60 cursor-not-allowed relative'>
        <div className='text-xs font-semibold text-rose-override uppercase tracking-wider mb-2'>Occupied</div>
        <div className='font-semibold text-lg text-on-surface-variant mb-1'>{name}</div>
        <div className='text-sm text-slate-500'>{location.split(',')[1]?.trim() || location}</div>
      </div>
    );
  }

  return (
    <div 
      onClick={onSelect}
      className={`border rounded-lg p-3 cursor-pointer transition-all hover:-translate-y-1 relative group ${
        isSelected 
          ? 'border-2 border-indigo-override bg-indigo-override/10 shadow-lg shadow-indigo-override/10' 
          : 'border-outline-override bg-[#0F172A] hover:border-indigo-override'
      }`}
    >
      <div className='absolute top-2 right-2 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity'>
        {amenities.map((amenity, idx) => {
          const icon = getAmenityIcon(amenity);
          return icon ? (
            <span key={idx} className={`material-symbols-outlined text-[14px] ${isSelected ? 'text-indigo-override' : 'text-on-surface-variant'}`}>
              {icon}
            </span>
          ) : null;
        })}
      </div>
      <div className='text-xs font-semibold text-emerald-override uppercase tracking-wider mb-2'>Available</div>
      <div className='font-semibold text-lg text-white mb-1'>{name}</div>
      <div className='text-sm text-on-surface-variant'>{location.split(',')[1]?.trim() || location}</div>
    </div>
  );
}