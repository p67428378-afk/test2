import React, { useState, useEffect } from 'react';
import { getStaff } from '../services/api';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getStaff();
        setStaff(response.data.staff);
      } catch (err) {
        setError('Failed to fetch staff.');
        console.error(err);
      }
    };

    fetchStaff();
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Staff</h2>
      <div className='bg-white p-4 rounded-lg shadow'>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='text-left'>Name</th>
              <th className='text-left'>Role</th>
              <th className='text-left'>Email</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.id}>
                <td>{member.firstName} {member.lastName}</td>
                <td>{member.role}</td>
                <td>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
