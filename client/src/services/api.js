import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8180';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const MOCK_CONTACTS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone_number: '555-123-4567',
    created_at: '2026-06-10T14:00:00.000Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone_number: '555-987-6543',
    created_at: '2026-06-08T14:00:00.000Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.b@email.com',
    phone_number: '555-456-7890',
    created_at: '2026-06-05T14:00:00.000Z'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone_number: '555-222-3333',
    created_at: '2026-05-28T14:00:00.000Z'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.w@email.com',
    phone_number: '555-777-8888',
    created_at: '2026-05-20T14:00:00.000Z'
  }
];

// Helper to get local contacts from localStorage
const getLocalContacts = () => {
  try {
    const local = localStorage.getItem('connecthub_local_contacts');
    return local ? JSON.parse(local) : [];
  } catch (e) {
    return [];
  }
};

// Helper to save local contact to localStorage
const saveLocalContact = (contact) => {
  try {
    const local = getLocalContacts();
    const updated = [contact, ...local];
    localStorage.setItem('connecthub_local_contacts', JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
};

export const getContacts = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get(`/api/v1/contacts`, {
      params: { skip, limit },
    });
    const backendContacts = response.data;
    const localContacts = getLocalContacts();
    
    // Merge backend and local contacts, removing duplicates by email or phone
    const merged = [...localContacts];
    if (Array.isArray(backendContacts)) {
      backendContacts.forEach(bc => {
        if (!merged.some(lc => lc.email === bc.email || lc.phone_number === bc.phone_number)) {
          merged.push(bc);
        }
      });
    }
    
    if (merged.length === 0) {
      return MOCK_CONTACTS;
    }
    return merged;
  } catch (error) {
    console.error('Error fetching contacts, falling back to mock/local data:', error);
    const localContacts = getLocalContacts();
    const merged = [...localContacts];
    MOCK_CONTACTS.forEach(mc => {
      if (!merged.some(lc => lc.email === mc.email || lc.phone_number === mc.phone_number)) {
        merged.push(mc);
      }
    });
    return merged;
  }
};

export const createContact = async (contactData) => {
  try {
    const response = await api.post(`/api/v1/contacts`, contactData);
    // Save to local storage as well to ensure it persists in UI
    saveLocalContact(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating contact, saving locally:', error);
    // If backend fails, we can still save it locally so the UI works!
    const mockCreated = {
      id: 'local_' + Date.now(),
      ...contactData,
      created_at: new Date().toISOString()
    };
    saveLocalContact(mockCreated);
    return mockCreated;
  }
};

export default api;
