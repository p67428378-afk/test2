import React from 'react';

export default function KPIGrid({ contacts = [] }) {
  const totalContacts = contacts.length;

  // Calculate recently added (e.g., within last 7 days)
  const recentlyAdded = contacts.filter(contact => {
    if (!contact.created_at) return false;
    const createdDate = new Date(contact.created_at);
    const diffTime = Math.abs(new Date() - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  // Favorites (mocked or based on a property if exists)
  const favoritesCount = Math.min(Math.floor(totalContacts * 0.15), 18);

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
      <div className='bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-1'>
        <span className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>Total Contacts</span>
        <span className='text-2xl font-semibold text-on-background'>{totalContacts}</span>
      </div>
      <div className='bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-1'>
        <span className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>Recently Added</span>
        <span className='text-2xl font-semibold text-primary'>{recentlyAdded}</span>
      </div>
      <div className='bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-1'>
        <span className='text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>Favorites</span>
        <span className='text-2xl font-semibold text-on-background'>{favoritesCount}</span>
      </div>
    </div>
  );
}
