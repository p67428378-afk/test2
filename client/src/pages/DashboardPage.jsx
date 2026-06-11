import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContacts } from '../services/api';
import KPIGrid from '../components/contacts/KPIGrid';
import ContactTable from '../components/contacts/ContactTable';

export default function DashboardPage({ searchQuery = '' }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await getContacts(0, 100);
        setContacts(data);
        setError('');
      } catch (err) {
        setError('Failed to load contacts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter and search contacts
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone_number.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filter === 'recent') {
      if (!contact.created_at) return false;
      const createdDate = new Date(contact.created_at);
      const diffTime = Math.abs(new Date() - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }

    return true;
  });

  return (
    <div>
      {/* Header Section */}
      <div className='mb-6'>
        <h2 className='text-3xl font-bold text-on-background mb-1'>My Contacts</h2>
        <p className='text-base text-on-surface-variant'>Manage and organize your phone contacts</p>
      </div>

      {/* KPI Cards */}
      <KPIGrid contacts={contacts} />

      {/* Action Bar */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
        <div className='flex flex-1 gap-4 w-full md:w-auto'>
          <div className='relative min-w-[200px]'>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='bg-surface-container-lowest border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 appearance-none pr-8'
            >
              <option value='all'>All Contacts</option>
              <option value='recent'>Recently Added</option>
              <option value='favorites'>Favorites</option>
            </select>
            <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
              <span className='material-symbols-outlined text-outline'>expand_more</span>
            </div>
          </div>
        </div>
        <Link
          to='/add'
          className='bg-primary-container text-on-primary font-semibold text-sm px-4 py-2 rounded-lg hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap'
        >
          <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>
            add
          </span>
          Add Contact
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className='p-4 mb-6 bg-error-container text-on-error-container rounded-xl text-sm' role='alert'>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className='flex justify-center items-center p-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : (
        <ContactTable contacts={filteredContacts} />
      )}
    </div>
  );
}
