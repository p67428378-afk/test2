import React from 'react';

export default function ContactTable({ contacts = [] }) {
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden mb-4'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-container-low border-b border-outline-variant'>
              <th className='p-4 text-sm font-medium text-on-surface-variant w-1/3'>Name</th>
              <th className='p-4 text-sm font-medium text-on-surface-variant'>Phone Number</th>
              <th className='p-4 text-sm font-medium text-on-surface-variant'>Date Added</th>
              <th className='p-4 text-sm font-medium text-on-surface-variant text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-outline-variant'>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan='4' className='p-8 text-center text-on-surface-variant'>
                  No contacts found.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id} className='hover:bg-surface-bright transition-colors group'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center text-sm font-semibold shrink-0'>
                        {getInitials(contact.name)}
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-on-background'>{contact.name}</p>
                        <p className='text-sm text-on-surface-variant'>{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 text-sm text-on-surface'>{contact.phone_number}</td>
                  <td className='p-4 text-sm text-on-surface'>{formatDate(contact.created_at)}</td>
                  <td className='p-4'>
                    <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button className='p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors' title='View'>
                        <span className='material-symbols-outlined text-[20px]'>visibility</span>
                      </button>
                      <button className='p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors' title='Edit'>
                        <span className='material-symbols-outlined text-[20px]'>edit</span>
                      </button>
                      <button className='p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-md transition-colors' title='Delete'>
                        <span className='material-symbols-outlined text-[20px]'>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
