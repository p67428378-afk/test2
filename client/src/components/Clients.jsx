import React, { useState, useEffect } from 'react';
import { getClients, createClient } from '../services/api';
import Modal from 'react-modal';

const Clients = ({ token }) => {
    const [clients, setClients] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await getClients(token);
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, [token]);

    const handleCreateClient = async (e) => {
        e.preventDefault();
        try {
            const createdClient = await createClient(token, newClient);
            setClients([...clients, createdClient]);
            setModalIsOpen(false);
            setNewClient({ name: '', email: '', phone: '', address: '' });
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Clients</h2>
            <button onClick={() => setModalIsOpen(true)} className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add Client</button>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Add Client Modal">
                <h2 className="text-xl font-semibold text-gray-800">Add New Client</h2>
                <form onSubmit={handleCreateClient} className="mt-4 space-y-4">
                    <input type="text" placeholder="Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <input type="email" placeholder="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <input type="text" placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <input type="text" placeholder="Address" value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} className="w-full px-3 py-2 border rounded" />
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded">Create</button>
                </form>
            </Modal>

            <div className="mt-6">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Name</th>
                            <th className="py-2">Email</th>
                            <th className="py-2">Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.client_id}>
                                <td className="px-4 py-2 border">{client.name}</td>
                                <td className="px-4 py-2 border">{client.email}</td>
                                <td className="px-4 py-2 border">{client.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;
