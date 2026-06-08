import React, { useState, useEffect } from 'react';
import { createTimeEntry, getMatters, getClients } from '../services/api'; // Assuming getUsers is available
import Modal from 'react-modal';

const TimeTracking = ({ token }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newTimeEntry, setNewTimeEntry] = useState({ matter_id: '', user_id: '', hours: '', description: '', date: '' });
    const [matters, setMatters] = useState([]);
    const [users, setUsers] = useState([]); // Assuming you have a way to get users

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mattersData = await getMatters(token);
                setMatters(mattersData);
                // Fetch users here if you have an API endpoint for it
                // const usersData = await getUsers(token);
                // setUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [token]);

    const handleCreateTimeEntry = async (e) => {
        e.preventDefault();
        try {
            await createTimeEntry(token, newTimeEntry);
            setModalIsOpen(false);
            setNewTimeEntry({ matter_id: '', user_id: '', hours: '', description: '', date: '' });
            // Refresh time entry list
        } catch (error) {
            console.error('Error creating time entry:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Time Tracking</h2>
            <button onClick={() => setModalIsOpen(true)} className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add Time Entry</button>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Add Time Entry Modal">
                <h2 className="text-xl font-semibold text-gray-800">Add New Time Entry</h2>
                <form onSubmit={handleCreateTimeEntry} className="mt-4 space-y-4">
                    <select value={newTimeEntry.matter_id} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, matter_id: e.target.value })} className="w-full px-3 py-2 border rounded">
                        <option value="">Select Matter</option>
                        {matters.map(matter => (
                            <option key={matter.matter_id} value={matter.matter_id}>{matter.case_name}</option>
                        ))}
                    </select>
                    {/* You would have a similar select for users */}
                    <input type="number" placeholder="Hours" value={newTimeEntry.hours} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, hours: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <textarea placeholder="Description" value={newTimeEntry.description} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, description: e.target.value })} className="w-full px-3 py-2 border rounded"></textarea>
                    <input type="date" value={newTimeEntry.date} onChange={(e) => setNewTimeEntry({ ...newTimeEntry, date: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded">Create</button>
                </form>
            </Modal>

            {/* Time entry list would go here */}
        </div>
    );
};

export default TimeTracking;
