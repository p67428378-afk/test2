import React, { useState, useEffect } from 'react';
import { getInvoices } from '../services/api';

const Billing = ({ token }) => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getInvoices(token);
                setInvoices(data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };
        fetchInvoices();
    }, [token]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800">Billing & Invoices</h2>
            {/* Invoice creation UI would go here */}
            <div className="mt-6">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2">Invoice ID</th>
                            <th className="py-2">Client</th>
                            <th className="py-2">Matter</th>
                            <th className="py-2">Total Amount</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(invoice => (
                            <tr key={invoice.invoice_id}>
                                <td className="px-4 py-2 border">{invoice.invoice_id}</td>
                                <td className="px-4 py-2 border">{invoice.client_id}</td>{/* Replace with client name */}
                                <td className="px-4 py-2 border">{invoice.matter_id}</td>{/* Replace with matter name */}
                                <td className="px-4 py-2 border">${invoice.total_amount.toFixed(2)}</td>
                                <td className="px-4 py-2 border">{invoice.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Billing;
