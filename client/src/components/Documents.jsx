import React, { useState, useEffect } from 'react';
import { uploadDocument, getMatters } from '../services/api';
import Modal from 'react-modal';

const Documents = ({ token }) => {
    const [matters, setMatters] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedMatter, setSelectedMatter] = useState('');

    useEffect(() => {
        const fetchMatters = async () => {
            try {
                const data = await getMatters(token);
                setMatters(data);
            } catch (error) {
                console.error('Error fetching matters:', error);
            }
        };
        fetchMatters();
    }, [token]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !selectedMatter) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('matter_id', selectedMatter);

        try {
            await uploadDocument(token, formData);
            setModalIsOpen(false);
            setSelectedFile(null);
            setSelectedMatter('');
            // You might want to refresh the document list here
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Documents</h2>
            <button onClick={() => setModalIsOpen(true)} className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Upload Document</button>

            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} contentLabel="Upload Document Modal">
                <h2 className="text-xl font-semibold text-gray-800">Upload New Document</h2>
                <form onSubmit={handleUpload} className="mt-4 space-y-4">
                    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="w-full px-3 py-2 border rounded" />
                    <select value={selectedMatter} onChange={(e) => setSelectedMatter(e.target.value)} className="w-full px-3 py-2 border rounded">
                        <option value="">Select Matter</option>
                        {matters.map(matter => (
                            <option key={matter.matter_id} value={matter.matter_id}>{matter.case_name}</option>
                        ))}
                    </select>
                    <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded">Upload</button>
                </form>
            </Modal>

            {/* Document list would go here */}
        </div>
    );
};

export default Documents;
