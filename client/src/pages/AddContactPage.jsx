import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createContact } from '../services/api';
import ContactForm from '../components/contacts/ContactForm';

export default function AddContactPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (contactData) => {
    try {
      setIsSubmitting(true);
      setError('');
      await createContact(contactData);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(err.response.data.detail || 'Contact with this phone number or email already exists.');
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data.detail || 'Validation failed. Please check your inputs.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className='mb-6'>
        <h2 className='text-3xl font-bold text-on-background mb-1'>Add Contact</h2>
        <p className='text-base text-on-surface-variant'>Create a new contact in your ConnectHub directory</p>
      </div>

      <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
    </div>
  );
}
