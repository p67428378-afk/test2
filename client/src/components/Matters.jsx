import React, { useState, useEffect } from 'react';
import { getMatters, createMatter, getClients } from '../services/api';
import Modal from 'react-modal';

const Matters = ({ token }) => {
    const [matters, setMatters] = useState([]);
    const [clients, setClients] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newMatter, setNewMatter] = useState({ case_name: '', client_id: '', description: '', status: '' });

    useEffect(() => {
        const fetchMatters = async () => {
            try {
                const data = await getMatters(token);
                setMatters(data);
            } catch (error) {
                console.error('Error fetching matters:', error);
            }
        };
        const fetchClients = async () => {
            try {
                const data = await getClients(token);
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchMatters();
        fetchClients();
    }, [token]);

    const handleCreateMatter = async (e) => {
        e.preventDefault();
        try {
            const createdMatter = await createMatter(token, newMatter);
            setMatters([...matters, createdMatter]);
            setModalIsOpen(false);
            setNewMatter({ case_name: '', client_id: '', description: '', status: '' });
        } catch (error) {
            console.error('Error creating matter:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Matters</h2>
            <button onClick={() => setModalIsOpen(true)} className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add Matter</button>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Add Matter Modal">
                <h2 className="text-xl font-semibold text-gray-800">Add New Matter</h2>
                <form onSubmit={handleCreateMatter} className="mt-4 space-y-4">
                    <input type="text" placeholder="Case Name" value={newMatter.case_name} onChange={(e) => setNewMatter({ ...newMatter, case_name: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <select value={newMatter.client_id} onChange={(e) => setNewMatter({ ...newMatter, client_id: e.target.value })} className="w-full px-3 py-2 border rounded">
                        <option value="">Select Client</option>
                        {clients.map(client => (
                            <option key={client.client_id} value={client.client_id}>{client.name}</option>
                        ))}
                    </select>
                    <textarea placeholder="Description" value={newMatter.description} onChange={(e) => setNewMatter({ ...newMatter, description: e.target.value })} className="w-full px-3 py-2 border rounded"></textarea>
                    <input type="text" placeholder="Status" value={newMatter.status} onChange={(e) => setNewMatter({ ...newMatter, status: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded">Create</button>
                </form>
            </Modal>

            <div className="mt-6">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Case Name</th>
                            <th className="py-2">Client</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matters.map(matter => (
                            <tr key={matter.matter_id}>
                                <td className="px-4 py-2 border">{matter.case_name}</td>
                                <td className="px-4 py-2 border">{clients.find(c => c.client_id === matter.client_id)?.name}</td>
                                <td className="px-4 py-2 border">{matter.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Matters;
